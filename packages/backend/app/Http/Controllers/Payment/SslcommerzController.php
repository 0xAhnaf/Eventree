<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Models\VendorRegistrationPayment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Raziul\Sslcommerz\Facades\Sslcommerz;

/**
 * Receives SSLCommerz callbacks for the vendor registration fee.
 *
 * Payment initiation lives in VendorRegistrationController@initiatePayment
 * (authenticated API call). These routes are public by necessity, so nothing
 * in the request is trusted: every success is re-validated against the
 * SSLCommerz validation API using the amount/currency stored in OUR database.
 */
class SslcommerzController extends Controller
{
    public function success(Request $request): RedirectResponse
    {
        $payment = $this->findPayment($request);

        if (! $payment) {
            return $this->toFrontend('failed', null, 'unknown_transaction');
        }

        return $this->settle($payment, $request)
            ? $this->toFrontend('success', $payment)
            : $this->toFrontend('failed', $payment, 'validation_failed');
    }

    public function failure(Request $request): RedirectResponse
    {
        $payment = $this->findPayment($request);

        if ($payment) {
            $this->markIfPending($payment, VendorRegistrationPayment::STATUS_FAILED, $request->input('error'));
        }

        return $this->toFrontend('failed', $payment, 'payment_failed');
    }

    public function cancel(Request $request): RedirectResponse
    {
        $payment = $this->findPayment($request);

        if ($payment) {
            $this->markIfPending($payment, VendorRegistrationPayment::STATUS_CANCELLED);
        }

        return $this->toFrontend('cancelled', $payment);
    }

    /**
     * Server-to-server notification. Needs a publicly reachable URL
     * (ngrok in local dev) and the IPN URL set in the SSLCommerz merchant panel.
     */
    public function ipn(Request $request): JsonResponse
    {
        if (! $request->filled('tran_id') || ! $request->filled('val_id')) {
            return response()->json(['message' => 'Invalid IPN payload'], 400);
        }

        $payment = $this->findPayment($request);

        if (! $payment) {
            return response()->json(['message' => 'Transaction not found'], 404);
        }

        if (! Sslcommerz::verifyHash($request->all())) {
            return response()->json(['message' => 'IPN hash verification failed'], 400);
        }

        return $this->settle($payment, $request)
            ? response()->json(['message' => 'IPN processed'])
            : response()->json(['message' => 'IPN validation failed'], 400);
    }

    private function findPayment(Request $request): ?VendorRegistrationPayment
    {
        $tranId = $request->input('tran_id');

        return is_string($tranId) && $tranId !== ''
            ? VendorRegistrationPayment::where('tran_id', $tranId)->first()
            : null;
    }

    /**
     * Idempotent: the success redirect and the IPN both call this and may race.
     */
    private function settle(VendorRegistrationPayment $payment, Request $request): bool
    {
        if ($payment->isPaid()) {
            return true;
        }

        try {
            // Amount and currency come from our DB, never from the request.
            $isValid = Sslcommerz::validatePayment(
                $request->all(),
                $payment->tran_id,
                (float) $payment->amount,
                $payment->currency,
            );
        } catch (\Throwable $e) {
            Log::error('SSLCommerz validation threw', [
                'tran_id' => $payment->tran_id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }

        if (! $isValid) {
            $this->markIfPending($payment, VendorRegistrationPayment::STATUS_FAILED, 'validation_failed');

            return false;
        }

        DB::transaction(function () use ($payment, $request) {
            $locked = VendorRegistrationPayment::whereKey($payment->id)->lockForUpdate()->first();

            if ($locked->isPaid()) {
                return;
            }

            $locked->forceFill([
                'status' => VendorRegistrationPayment::STATUS_PAID,
                'val_id' => $request->input('val_id'),
                'bank_tran_id' => $request->input('bank_tran_id'),
                'card_type' => $request->input('card_type'),
                'failure_reason' => null,
                'paid_at' => now(),
            ])->save();

            $profile = $locked->vendorProfile;

            // This is the ONLY place registration payment is marked complete.
            $profile->forceFill([
                'onboarding_completed_at' => $profile->onboarding_completed_at ?? now(),
                'registration_payment_completed_at' => $profile->registration_payment_completed_at ?? now(),
            ])->save();
        });

        return true;
    }

    private function markIfPending(VendorRegistrationPayment $payment, string $status, ?string $reason = null): void
    {
        VendorRegistrationPayment::whereKey($payment->id)
            ->where('status', VendorRegistrationPayment::STATUS_PENDING)
            ->update([
                'status' => $status,
                'failure_reason' => $reason ? mb_substr($reason, 0, 250) : null,
                'updated_at' => now(),
            ]);
    }

    /**
     * The query string is only a UI hint. The result page re-checks the real
     * state through GET /api/vendor/registration-status.
     */
    private function toFrontend(string $status, ?VendorRegistrationPayment $payment = null, ?string $reason = null): RedirectResponse
    {
        $query = array_filter([
            'status' => $status,
            'tran_id' => $payment?->tran_id,
            'reason' => $reason,
        ]);

        $url = rtrim(config('app.frontend_url'), '/').'/vendor/payment/result?'.http_build_query($query);

        // 303 so the browser turns the gateway's POST into a GET.
        return redirect()->away($url, 303);
    }
}
