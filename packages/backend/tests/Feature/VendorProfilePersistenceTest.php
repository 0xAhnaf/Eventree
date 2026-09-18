<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\VendorCategory;
use App\Models\VendorImage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class VendorProfilePersistenceTest extends TestCase
{
    use RefreshDatabase;

    public function test_vendor_profile_fields_amenities_and_packages_persist(): void
    {
        $vendor = User::factory()->create(['role' => 'vendor']);
        $category = VendorCategory::create(['name' => 'Caterers']);

        Sanctum::actingAs($vendor);

        $this->postJson('/api/vendor-profile', [
            'business_name' => 'Original Catering',
            'category_id' => $category->id,
            'description' => 'Original description',
            'city' => 'Dhaka',
            'full_address' => 'Road 1, Dhaka',
            'business_email' => 'original@example.com',
            'phone' => '01710000001',
            'website' => 'https://example.com',
            'manager_name' => 'Original Manager',
            'years_of_experience' => 2,
            'events_completed' => 10,
            'starting_price' => 3000,
        ])->assertCreated();

        $this->putJson('/api/vendor-profile', [
            'business_name' => 'Updated Catering',
            'category_id' => $category->id,
            'description' => 'Updated description',
            'city' => 'Chattogram',
            'full_address' => 'Road 2, Chattogram',
            'business_email' => 'updated@example.com',
            'phone' => '01710000002',
            'website' => 'https://updated.example.com',
            'manager_name' => 'Updated Manager',
            'years_of_experience' => 4,
            'events_completed' => 25,
            'starting_price' => 5500,
        ])->assertOk();

        $this->postJson('/api/vendor-details', [
            'amenities' => ['On-site parking', 'Sound system'],
            'packages' => [[
                'package_name' => 'Premium',
                'description' => "Food\nDecoration",
                'price' => 25000,
            ]],
        ])->assertOk();

        $this->getJson('/api/vendor-profile')
            ->assertOk()
            ->assertJsonPath('vendor_profile.business_name', 'Updated Catering')
            ->assertJsonPath('vendor_profile.city', 'Chattogram')
            ->assertJsonPath('vendor_profile.amenities.0.amenity_name', 'On-site parking')
            ->assertJsonPath('vendor_profile.packages.0.package_name', 'Premium');

        $this->assertDatabaseHas('vendor_profiles', [
            'user_id' => $vendor->id,
            'business_name' => 'Updated Catering',
            'starting_price' => 5500,
        ]);

        $this->assertNotNull(
            $vendor->vendorProfile()->first()->onboarding_completed_at
        );
    }

    public function test_vendor_can_select_a_portfolio_image_as_cover(): void
    {
        $vendor = User::factory()->create(['role' => 'vendor']);
        $category = VendorCategory::create(['name' => 'Photography']);

        Sanctum::actingAs($vendor);

        $this->postJson('/api/vendor-profile', [
            'business_name' => 'Photo Studio',
            'category_id' => $category->id,
            'description' => 'Event photography',
            'city' => 'Dhaka',
            'full_address' => 'Road 1, Dhaka',
            'business_email' => 'studio@example.com',
            'phone' => '01710000003',
            'manager_name' => 'Studio Manager',
        ])->assertCreated();

        $profile = $vendor->vendorProfile()->firstOrFail();
        $portfolioImage = VendorImage::create([
            'vendor_profile_id' => $profile->id,
            'image_type' => 'portfolio',
            'image_url' => 'https://example.com/portfolio.jpg',
            'public_id' => 'test/portfolio-cover',
            'sort_order' => 1,
        ]);

        $this->putJson("/api/vendor-profile/cover-image/{$portfolioImage->id}")
            ->assertOk()
            ->assertJsonPath('image.id', $portfolioImage->id);

        $this->getJson('/api/vendor-profile')
            ->assertOk()
            ->assertJsonPath('vendor_profile.cover_image_id', $portfolioImage->id)
            ->assertJsonPath('vendor_profile.images.0.image_type', 'portfolio');

        $this->deleteJson("/api/vendor-profile/images/{$portfolioImage->id}")
            ->assertUnprocessable()
            ->assertJsonPath(
                'message',
                'Choose another cover image before deleting this image.'
            );
    }
}
