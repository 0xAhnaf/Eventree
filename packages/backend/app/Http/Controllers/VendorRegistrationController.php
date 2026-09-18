<?php

namespace App\Http\Controllers;

use App\Models\VendorProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VendorRegistrationController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $profile = $this->profileFor($request);

        return response()->json($this->statusPayload($profile));
    }

    public function completePayment(Request $request): JsonResponse
    {
        $profile = $this->profileFor($request);

        // This endpoint records the current frontend-only/mock payment. A real
        // gateway callback must replace it when payment integration is added.
        $profile->forceFill([
            'onboarding_completed_at' => $profile->onboarding_completed_at ?? now(),
            'registration_payment_completed_at' =>
                $profile->registration_payment_completed_at ?? now(),
        ])->save();

        return response()->json([
            'message' => 'Vendor registration payment recorded successfully.',
            ...$this->statusPayload($profile->refresh()),
        ]);
    }

    private function profileFor(Request $request): VendorProfile
    {
        abort_unless(
            $request->user()?->role === 'vendor',
            403,
            'Only vendors can manage registration status.'
        );

        $profile = VendorProfile::where('user_id', $request->user()->id)->first();

        abort_unless($profile, 404, 'Vendor profile not found.');

        return $profile;
    }

    private function statusPayload(VendorProfile $profile): array
    {
        return [
            'vendor_profile_id' => $profile->id,
            'onboarding_completed' => $profile->onboarding_completed_at !== null,
            'payment_completed' => $profile->registration_payment_completed_at !== null,
            'is_public' => $profile->onboarding_completed_at !== null
                && $profile->registration_payment_completed_at !== null,
        ];
    }
}
