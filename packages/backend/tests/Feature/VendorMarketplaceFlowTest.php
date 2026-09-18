<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\VendorCategory;
use App\Models\VendorPackage;
use App\Models\VendorProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class VendorMarketplaceFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_vendor_list_and_details_use_database_profiles(): void
    {
        [$vendor, $profile] = $this->createVendorProfile();

        $this->getJson('/api/vendors')
            ->assertOk()
            ->assertJsonPath('vendors.0.id', $profile->id)
            ->assertJsonPath('vendors.0.name', 'Real Event Studio')
            ->assertJsonPath('vendors.0.location', 'Dhaka');

        $this->getJson("/api/vendors/{$profile->id}")
            ->assertOk()
            ->assertJsonPath('vendor.userId', $vendor->id)
            ->assertJsonPath('vendor.packages.0.name', 'Gold Package');
    }

    public function test_only_completed_vendor_registration_is_public(): void
    {
        [$vendor, $profile] = $this->createVendorProfile(false);

        $this->getJson('/api/vendors')
            ->assertOk()
            ->assertJsonPath('vendors', []);

        $this->getJson("/api/vendors/{$profile->id}")
            ->assertNotFound();

        Sanctum::actingAs($vendor);

        $this->postJson('/api/vendor/registration-payment/complete')
            ->assertOk()
            ->assertJsonPath('onboarding_completed', true)
            ->assertJsonPath('payment_completed', true)
            ->assertJsonPath('is_public', true);

        $this->getJson('/api/vendors')
            ->assertOk()
            ->assertJsonPath('vendors.0.id', $profile->id);
    }

    public function test_date_is_reserved_only_after_vendor_accepts_booking(): void
    {
        [$vendor, $profile, $package] = $this->createVendorProfile();
        $customer = User::factory()->create(['role' => 'customer']);
        $secondCustomer = User::factory()->create(['role' => 'customer']);
        $eventDate = now()->addDays(10)->toDateString();

        Sanctum::actingAs($customer);

        $bookingResponse = $this->postJson('/api/bookings', [
            'vendor_id' => $profile->id,
            'package_id' => $package->id,
            'event_date' => $eventDate,
            'event_type' => 'Wedding',
            'guests' => 120,
        ])->assertCreated();

        $bookingId = $bookingResponse->json('booking.id');

        $this->getJson("/api/vendors/{$profile->id}/availability")
            ->assertOk()
            ->assertJsonPath('unavailable_dates', []);

        Sanctum::actingAs($secondCustomer);

        $secondBookingId = $this->postJson('/api/bookings', [
            'vendor_id' => $profile->id,
            'package_id' => $package->id,
            'event_date' => $eventDate,
            'event_type' => 'Birthday',
            'guests' => 40,
        ])->assertCreated()->json('booking.id');

        Sanctum::actingAs($vendor);

        $this->getJson('/api/vendor/bookings')
            ->assertOk()
            ->assertJsonFragment(['clientEmail' => $customer->email])
            ->assertJsonFragment(['clientEmail' => $secondCustomer->email]);

        $this->patchJson("/api/vendor/bookings/{$bookingId}/status", [
            'status' => 'accepted',
        ])->assertOk();

        $this->getJson("/api/vendors/{$profile->id}/availability")
            ->assertOk()
            ->assertJsonPath('unavailable_dates.0', $eventDate);

        $this->assertDatabaseHas('vendor_bookings', [
            'id' => $secondBookingId,
            'status' => 'rejected',
        ]);

        $this->patchJson("/api/vendor/bookings/{$bookingId}/status", [
            'status' => 'rejected',
        ])->assertOk();

        $this->getJson("/api/vendors/{$profile->id}/availability")
            ->assertOk()
            ->assertJsonPath('unavailable_dates', []);
    }

    public function test_vendor_blocked_date_prevents_booking(): void
    {
        [$vendor, $profile] = $this->createVendorProfile();
        $customer = User::factory()->create(['role' => 'customer']);
        $eventDate = now()->addDays(12)->toDateString();

        Sanctum::actingAs($vendor);

        $this->putJson('/api/vendor/availability', [
            'blocked_dates' => [$eventDate],
        ])->assertOk();

        Sanctum::actingAs($customer);

        $this->postJson('/api/bookings', [
            'vendor_id' => $profile->id,
            'event_date' => $eventDate,
            'event_type' => 'Corporate Event',
            'guests' => 50,
        ])->assertStatus(422);
    }

    private function createVendorProfile(bool $registrationComplete = true): array
    {
        $vendor = User::factory()->create(['role' => 'vendor']);
        $category = VendorCategory::create(['name' => 'Event Management']);

        $profile = VendorProfile::create([
            'user_id' => $vendor->id,
            'business_name' => 'Real Event Studio',
            'category_id' => $category->id,
            'description' => 'Database-backed vendor profile.',
            'city' => 'Dhaka',
            'full_address' => 'Dhanmondi, Dhaka',
            'business_email' => 'studio@example.com',
            'phone' => '01700000001',
            'website' => 'https://example.com',
            'manager_name' => 'Studio Manager',
            'years_of_experience' => 5,
            'events_completed' => 40,
            'starting_price' => 5000,
            'onboarding_completed_at' => $registrationComplete ? now() : null,
            'registration_payment_completed_at' => $registrationComplete ? now() : null,
        ]);

        $package = VendorPackage::create([
            'vendor_profile_id' => $profile->id,
            'package_name' => 'Gold Package',
            'description' => "Planning\nCoordination",
            'price' => 15000,
            'sort_order' => 0,
        ]);

        return [$vendor, $profile, $package];
    }
}
