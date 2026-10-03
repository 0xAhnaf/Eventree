<?php

namespace App\Http\Controllers;

use App\Models\VendorProfile;
use App\Models\VendorRegistrationPayment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Raziul\Sslcommerz\Facades\Sslcommerz;

class VendorRegistrationController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $profile = $this->profileFor($request);

        return response()->json($this->statusPayload($profile));
    }

    /**
     * Starts an SSLCommerz session and returns the hosted payment page URL.
     *
     * Payment is NOT marked as complete here.
     * Only the validated SSLCommerz callback can mark the payment as paid.
     */
    public function initiatePayment(Request $request): JsonResponse
    {
        $profile = $this->profileFor($request);
        $user = $request->user();

        abort_if(
            $profile->onboarding_completed_at === null,
            409,
            'Complete onboarding before paying the registration fee.'
        );

        if ($profile->registration_payment_completed_at !== null) {
            return response()->json([
                'message' => 'Registration payment is already completed.',
                'already_paid' => true,
                ...$this->statusPayload($profile),
            ]);
        }

        $payment = $profile->registrationPayments()->create([
            'tran_id' => 'VREG-'.$profile->id.'-'.strtoupper(Str::random(10)),
            'amount' => config('eventree.registration_fee'),
            'currency' => config('eventree.currency', 'BDT'),
            'status' => VendorRegistrationPayment::STATUS_PENDING,
        ]);

        $address = $profile->full_address ?: 'Dhaka';
        $city = $profile->city ?: 'Dhaka';
        $phone = $profile->phone ?: ($user->phone ?: '01700000000');
        $email = $profile->business_email ?: $user->email;

        try {
            $response = Sslcommerz::setOrder(
                (float) $payment->amount,
                $payment->tran_id,
                'Eventree vendor registration',
                'Vendor Registration'
            )
                ->setCustomer(
                    name: $user->name,
                    email: $email,
                    phone: $phone,
                    address: $address,
                    city: $city,
                    state: $city,
                    postal: '1000',
                    country: 'Bangladesh'
                )
                ->setShippingInfo(
                    quantity: 1,
                    address: $address,
                    name: $user->name,
                    city: $city,
                    state: $city,
                    postal: '1000',
                    country: 'Bangladesh'
                )
                ->makePayment();
        } catch (\Throwable $e) {
            Log::error('SSLCommerz initiation threw', [
                'tran_id' => $payment->tran_id,
                'error' => $e->getMessage(),
            ]);

            $payment->update([
                'status' => VendorRegistrationPayment::STATUS_FAILED,
                'failure_reason' => 'gateway_unreachable',
            ]);

            return response()->json([
                'message' => 'The payment gateway could not be reached. Please try again.',
            ], 502);
        }

        if (! $response->success()) {
            Log::warning('SSLCommerz session rejected', [
                'tran_id' => $payment->tran_id,
                'reason' => $response->failedReason(),
            ]);

            $payment->update([
                'status' => VendorRegistrationPayment::STATUS_FAILED,
                'failure_reason' => mb_substr(
                    (string) $response->failedReason(),
                    0,
                    250
                ),
            ]);

            return response()->json([
                'message' => 'Unable to start the payment. Please try again.',
            ], 502);
        }

        $payment->update([
            'session_key' => $response->sessionKey(),
        ]);

        return response()->json([
            'gateway_url' => $response->gatewayPageURL(),
            'tran_id' => $payment->tran_id,
        ]);
    }

    private function profileFor(Request $request): VendorProfile
    {
        abort_unless(
            $request->user()?->role === 'vendor',
            403,
            'Only vendors can manage registration status.'
        );

        $profile = VendorProfile::where(
            'user_id',
            $request->user()->id
        )->first();

        abort_unless(
            $profile,
            404,
            'Vendor profile not found.'
        );

        return $profile;
    }

    private function statusPayload(VendorProfile $profile): array
    {
        return [
            'vendor_profile_id' => $profile->id,
            'onboarding_completed' =>
                $profile->onboarding_completed_at !== null,

            'payment_completed' =>
                $profile->registration_payment_completed_at !== null,

            'is_public' =>
                $profile->onboarding_completed_at !== null
                && $profile->registration_payment_completed_at !== null,

            'registration_fee' =>
                config('eventree.registration_fee'),

            'currency' =>
                config('eventree.currency', 'BDT'),
        ];
    }
}