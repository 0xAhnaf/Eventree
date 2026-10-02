<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\VendorCategory;
use App\Models\VendorProfile;
use App\Models\VendorRegistrationPayment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Raziul\Sslcommerz\Facades\Sslcommerz;
use Tests\TestCase;

class VendorRegistrationPaymentTest extends TestCase
{
    use RefreshDatabase;

    public function test_mock_complete_endpoint_no_longer_exists(): void
    {
        [$vendor] = $this->vendorWithProfile();
        Sanctum::actingAs($vendor);

        $this->postJson('/api/vendor/registration-payment/complete')->assertStatus(404);
    }

    public function test_valid_success_callback_marks_payment_and_profile_complete(): void
    {
        [, $profile, $payment] = $this->vendorWithPendingPayment();

        Sslcommerz::shouldReceive('validatePayment')
            ->once()
            ->with(\Mockery::type('array'), $payment->tran_id, 500.0, 'BDT')
            ->andReturnTrue();

        $this->post('/sslcommerz/success', [
            'tran_id' => $payment->tran_id,
            'val_id' => 'VAL123',
            'bank_tran_id' => 'BANK123',
            'card_type' => 'VISA-Dutch Bangla',
            'amount' => '1.00', // tampered amount must be ignored
        ])->assertRedirect();

        $this->assertSame('paid', $payment->refresh()->status);
        $this->assertNotNull($profile->refresh()->registration_payment_completed_at);
    }

    public function test_invalid_success_callback_does_not_complete_registration(): void
    {
        [, $profile, $payment] = $this->vendorWithPendingPayment();

        Sslcommerz::shouldReceive('validatePayment')->once()->andReturnFalse();

        $this->post('/sslcommerz/success', ['tran_id' => $payment->tran_id, 'val_id' => 'FAKE'])
            ->assertRedirect();

        $this->assertSame('failed', $payment->refresh()->status);
        $this->assertNull($profile->refresh()->registration_payment_completed_at);
    }

    public function test_cancel_callback_marks_pending_payment_cancelled(): void
    {
        [, $profile, $payment] = $this->vendorWithPendingPayment();

        $this->post('/sslcommerz/cancel', ['tran_id' => $payment->tran_id])->assertRedirect();

        $this->assertSame('cancelled', $payment->refresh()->status);
        $this->assertNull($profile->refresh()->registration_payment_completed_at);
    }

    public function test_unknown_transaction_is_rejected_without_calling_gateway(): void
    {
        Sslcommerz::shouldReceive('validatePayment')->never();

        $this->post('/sslcommerz/success', ['tran_id' => 'NOPE'])->assertRedirect();
    }

    private function vendorWithProfile(): array
    {
        $vendor = User::factory()->create(['role' => 'vendor']);
        $category = VendorCategory::create(['name' => 'Catering']);

        $profile = VendorProfile::create([
            'user_id' => $vendor->id,
            'business_name' => 'Pay Test Studio',
            'category_id' => $category->id,
            'description' => 'x',
            'city' => 'Dhaka',
            'full_address' => 'Dhanmondi, Dhaka',
            'business_email' => 'pay@example.com',
            'phone' => '01700000002',
            'manager_name' => 'Manager',
            'onboarding_completed_at' => now(),
        ]);

        return [$vendor, $profile];
    }

    private function vendorWithPendingPayment(): array
    {
        [$vendor, $profile] = $this->vendorWithProfile();

        $payment = $profile->registrationPayments()->create([
            'tran_id' => 'VREG-TEST-0001',
            'amount' => 500,
            'currency' => 'BDT',
            'status' => 'pending',
        ]);

        return [$vendor, $profile, $payment];
    }
}
