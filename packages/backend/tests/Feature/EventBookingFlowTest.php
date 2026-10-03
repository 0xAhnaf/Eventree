<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\User;
use App\Models\VendorBooking;
use App\Models\VendorCategory;
use App\Models\VendorProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EventBookingFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function beforeRefreshingDatabase()
    {
        if (config('database.default') !== 'sqlite' ||
            config('database.connections.sqlite.database') !== ':memory:') {
            throw new \RuntimeException('Run EventBookingFlowTest only with SQLite :memory:.');
        }
    }

    private function account(string $role = 'customer'): User
    {
        static $number = 0;
        $number++;
        return User::create(['name' => 'Test '.$number, 'email' => 'event-test-'.$number.'@example.test',
            'phone' => '017'.str_pad((string) $number, 8, '0', STR_PAD_LEFT), 'password' => 'test-password', 'role' => $role]);
    }

    private function plannedEvent(User $customer, ?string $date = null): Event
    {
        return $customer->events()->create(['title' => 'Birthday', 'category' => 'Birthday',
            'date' => $date ?? now()->addDays(10)->format('Y-m-d'), 'location' => 'Dhaka',
            'guests' => 40, 'budget' => 100000, 'status' => 'Planning']);
    }

    private function vendor(string $category = 'Caterers'): VendorProfile
    {
        $user = $this->account('vendor');
        $category = VendorCategory::firstOrCreate(['name' => $category]);
        return VendorProfile::create(['user_id' => $user->id, 'business_name' => $user->name,
            'category_id' => $category->id, 'description' => 'Test vendor', 'city' => 'Dhaka',
            'full_address' => 'Dhaka', 'business_email' => $user->email, 'phone' => $user->phone,
            'manager_name' => $user->name, 'onboarding_completed_at' => now(),
            'registration_payment_completed_at' => now(), 'admin_approved_at' => now()]);
    }

    private function requestBooking(User $customer, Event $event, VendorProfile $vendor): int
    {
        Sanctum::actingAs($customer);
        return $this->postJson('/api/bookings', ['event_id' => $event->id, 'vendor_id' => $vendor->id])
            ->assertCreated()->json('booking.id');
    }

    public function test_customer_can_create_an_event_without_an_image_and_other_customers_cannot_read_it(): void
    {
        Mail::fake();
        $customer = $this->account();
        Sanctum::actingAs($customer);
        $id = $this->postJson('/api/events', ['title' => 'Birthday', 'category' => 'Birthday',
            'date' => now()->addDay()->format('Y-m-d'), 'location' => 'Dhaka', 'guests' => 40, 'budget' => 5000])
            ->assertCreated()->json('event.id');
        Sanctum::actingAs($this->account());
        $this->getJson('/api/events/'.$id)->assertNotFound();
        $this->getJson('/api/events')->assertOk()->assertJsonCount(0, 'events');
    }

    public function test_booking_requires_an_owned_event_and_derives_its_details_from_database(): void
    {
        $customer = $this->account();
        $event = $this->plannedEvent($customer);
        $vendor = $this->vendor();
        Sanctum::actingAs($customer);
        $this->postJson('/api/bookings', ['vendor_id' => $vendor->id])->assertUnprocessable();
        $this->postJson('/api/bookings', ['vendor_id' => $vendor->id, 'event_id' => $event->id,
            'event_date' => '2000-01-01', 'guests' => 999, 'event_type' => 'Forged'])
            ->assertCreated()->assertJsonPath('booking.guests', 40)->assertJsonPath('booking.eventType', 'Birthday')
            ->assertJsonPath('booking.eventDate', $event->date->format('Y-m-d'));
        Sanctum::actingAs($this->account());
        $this->postJson('/api/bookings', ['vendor_id' => $vendor->id, 'event_id' => $event->id])->assertNotFound();
    }

    public function test_first_acceptance_closes_same_category_only_and_hides_losing_requests(): void
    {
        $customer = $this->account();
        $event = $this->plannedEvent($customer);
        $first = $this->vendor();
        $second = $this->vendor();
        $other = $this->vendor('Decorations');
        $a = $this->requestBooking($customer, $event, $first);
        $b = $this->requestBooking($customer, $event, $second);
        $c = $this->requestBooking($customer, $event, $other);
        Sanctum::actingAs($first->user);
        $this->patchJson('/api/vendor/bookings/'.$a.'/status', ['status' => 'accepted'])->assertOk();
        $this->assertDatabaseHas('vendor_bookings', ['id' => $b, 'status' => 'rejected']);
        $this->assertDatabaseHas('vendor_bookings', ['id' => $c, 'status' => 'pending']);
        Sanctum::actingAs($second->user);
        $this->patchJson('/api/vendor/bookings/'.$b.'/status', ['status' => 'accepted'])->assertUnprocessable();
        Sanctum::actingAs($customer);
        $this->getJson('/api/events/'.$event->id)->assertOk()->assertJsonCount(2, 'event.bookings');
        $this->postJson('/api/bookings', ['event_id' => $event->id, 'vendor_id' => $second->id])->assertUnprocessable();
    }

    public function test_pending_request_does_not_reserve_date_but_accepted_booking_does(): void
    {
        $customer = $this->account();
        $event = $this->plannedEvent($customer);
        $otherEvent = $this->plannedEvent($customer);
        $vendor = $this->vendor();
        $first = $this->requestBooking($customer, $event, $vendor);
        $second = $this->requestBooking($customer, $otherEvent, $vendor);
        $this->assertDatabaseHas('vendor_bookings', ['id' => $first, 'active_date_key' => null]);
        Sanctum::actingAs($vendor->user);
        $this->patchJson('/api/vendor/bookings/'.$first.'/status', ['status' => 'accepted'])->assertOk();
        $this->assertDatabaseHas('vendor_bookings', ['id' => $second, 'status' => 'rejected']);
        $this->assertDatabaseHas('vendor_bookings', ['id' => $first, 'active_date_key' => $vendor->id.':'.$event->date->format('Y-m-d')]);
    }

    public function test_duplicate_requests_and_event_date_edits_are_rejected(): void
    {
        $customer = $this->account();
        $event = $this->plannedEvent($customer);
        $vendor = $this->vendor();
        $this->requestBooking($customer, $event, $vendor);
        $this->postJson('/api/bookings', ['event_id' => $event->id, 'vendor_id' => $vendor->id])->assertUnprocessable();
        $this->putJson('/api/events/'.$event->id, ['date' => now()->addDays(20)->format('Y-m-d')])->assertUnprocessable();
        $this->deleteJson('/api/events/'.$event->id)->assertUnprocessable();
        $this->putJson('/api/events/'.$event->id, ['title' => 'New title'])->assertOk();
    }

    public function test_completion_is_owned_date_guarded_and_closes_requests(): void
    {
        $customer = $this->account();
        $event = $this->plannedEvent($customer);
        $vendor = $this->vendor();
        $booking = $this->requestBooking($customer, $event, $vendor);
        Sanctum::actingAs($vendor->user);
        $this->patchJson('/api/vendor/bookings/'.$booking.'/status', ['status' => 'accepted'])->assertOk();
        Sanctum::actingAs($customer);
        $this->postJson('/api/events/'.$event->id.'/complete')->assertUnprocessable();
        $this->travel(10)->days();
        $this->postJson('/api/events/'.$event->id.'/complete')->assertOk()->assertJsonPath('event.status', 'Past');
        $this->assertDatabaseHas('vendor_bookings', ['id' => $booking, 'status' => 'completed']);
        $this->postJson('/api/events/'.$event->id.'/complete')->assertOk();
        $this->putJson('/api/events/'.$event->id, ['title' => 'Not allowed'])->assertUnprocessable();
        $this->travelBack();
    }

    public function test_manual_block_and_vendor_ownership_are_enforced(): void
    {
        $customer = $this->account();
        $event = $this->plannedEvent($customer);
        $vendor = $this->vendor();
        $id = $this->requestBooking($customer, $event, $vendor);
        \App\Models\VendorBlockedDate::create(['vendor_profile_id' => $vendor->id, 'blocked_date' => $event->date]);
        Sanctum::actingAs($vendor->user);
        $this->patchJson('/api/vendor/bookings/'.$id.'/status', ['status' => 'accepted'])->assertUnprocessable();
        Sanctum::actingAs($this->vendor()->user);
        $this->patchJson('/api/vendor/bookings/'.$id.'/status', ['status' => 'accepted'])->assertNotFound();
    }
}
