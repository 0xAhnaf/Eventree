<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\VendorBlockedDate;
use App\Models\VendorBooking;
use App\Models\VendorPackage;
use App\Models\VendorProfile;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class VendorBookingController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'customer') {
            return response()->json([
                'message' => 'Only customers can send booking requests.',
            ], 403);
        }

        $validated = $request->validate([
            'vendor_id' => ['required', 'integer', 'exists:vendor_profiles,id'],
            'package_id' => ['nullable', 'integer', 'exists:vendor_packages,id'],
            'event_id' => ['required', 'integer', 'exists:events,id'],
        ]);

        try {
            $booking = DB::transaction(function () use ($request, $validated) {
                $event = Event::whereKey($validated['event_id'])->lockForUpdate()->firstOrFail();
                abort_unless((int) $event->user_id === (int) $request->user()->id, 404, 'Event not found.');
                abort_if($event->completed_at || $event->status === 'Past' || $event->date->format('Y-m-d') < today()->format('Y-m-d'), 422, 'Choose an upcoming event.');
                abort_if($event->guests < 1, 422, 'Add a guest count to your event first.');
                // The database event, not user-supplied booking fields, owns these values.
                $validated['event_date'] = $event->date->format('Y-m-d');
                $validated['event_type'] = $event->category;
                $validated['guests'] = $event->guests;
                $profile = VendorProfile::query()
                    ->whereKey($validated['vendor_id'])
                    ->whereNotNull('onboarding_completed_at')
                    ->whereNotNull('registration_payment_completed_at')
                    ->whereNotNull('admin_approved_at')
                    ->whereHas('user', fn ($query) => $query->where('role', 'vendor'))
                    ->lockForUpdate()
                    ->firstOrFail();

                abort_if($event->bookings()->where('event_category_id', $profile->category_id)
                    ->whereIn('status', ['accepted', 'completed'])->exists(), 422, 'This event already has an accepted vendor in this category.');
                abort_if($event->bookings()->where('vendor_profile_id', $profile->id)
                    ->whereIn('status', ['pending', 'accepted', 'completed'])->exists(), 422, 'You already requested this vendor for this event.');

                $isBlocked = VendorBlockedDate::query()
                    ->where('vendor_profile_id', $profile->id)
                    ->whereDate('blocked_date', $validated['event_date'])
                    ->exists();

                if ($isBlocked) {
                    abort(422, 'This date has been blocked by the vendor.');
                }

                $hasAcceptedBooking = VendorBooking::query()
                    ->where('vendor_profile_id', $profile->id)
                    ->whereDate('event_date', $validated['event_date'])
                    ->where('status', 'accepted')
                    ->exists();

                if ($hasAcceptedBooking) {
                    abort(422, 'This date has already been booked.');
                }

                $package = null;
                if (! empty($validated['package_id'])) {
                    $package = VendorPackage::query()
                        ->whereKey($validated['package_id'])
                        ->where('vendor_profile_id', $profile->id)
                        ->first();

                    if (! $package) {
                        abort(422, 'The selected package does not belong to this vendor.');
                    }
                }

                return VendorBooking::create([
                    'event_id' => $event->id,
                    'event_category_id' => $profile->category_id,
                    'vendor_profile_id' => $profile->id,
                    'customer_id' => $request->user()->id,
                    'vendor_package_id' => $package?->id,
                    'event_date' => $validated['event_date'],
                    'event_type' => trim($validated['event_type']),
                    'guests' => $validated['guests'],
                    'package_name' => $package?->package_name,
                    'package_price' => $package?->price,
                    'status' => 'pending',
                    'active_date_key' => null,
                    'status_updated_at' => now(),
                ]);
            }, 3);
        } catch (QueryException $exception) {
            if ((string) $exception->getCode() === '23000') {
                return response()->json([
                    'message' => 'This date has already been booked.',
                ], 422);
            }

            throw $exception;
        }

        return response()->json([
            'message' => 'Booking request sent successfully.',
            'booking' => $this->serializeBooking($booking->load(['customer', 'vendorPackage'])),
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $profile = $this->vendorProfileFor($request);

        $bookings = $profile->bookings()
            ->with(['customer', 'vendorPackage'])
            ->orderBy('event_date')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (VendorBooking $booking) => $this->serializeBooking($booking));

        return response()->json(['bookings' => $bookings]);
    }

    public function updateStatus(Request $request, VendorBooking $booking): JsonResponse
    {
        $profile = $this->vendorProfileFor($request);

        abort_unless((int) $booking->vendor_profile_id === (int) $profile->id, 404, 'Booking not found.');

        $validated = $request->validate([
            'status' => ['required', Rule::in(['accepted', 'rejected', 'completed'])],
        ]);

        try {
            $booking = DB::transaction(function () use ($booking, $profile, $validated) {
                // Event first serializes competing acceptances for one event/category.
                $event = $booking->event_id
                    ? Event::whereKey($booking->event_id)->lockForUpdate()->firstOrFail() : null;
                VendorProfile::whereKey($profile->id)->lockForUpdate()->firstOrFail();
                $lockedBooking = VendorBooking::query()
                    ->whereKey($booking->id)
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($lockedBooking->vendor_profile_id !== $profile->id) {
                    abort(404, 'Booking not found.');
                }

                if (in_array($lockedBooking->status, ['rejected', 'completed'], true)) {
                    abort(422, 'This booking can no longer be changed.');
                }

                abort_if($event && ($event->completed_at || $event->status === 'Past'), 422, 'This event is completed.');
                if ($validated['status'] === 'completed') {
                    abort_if($lockedBooking->status !== 'accepted' || $lockedBooking->event_date->format('Y-m-d') >= today()->format('Y-m-d'), 422, 'Only an accepted booking after its event date can be completed.');
                }

                if ($validated['status'] === 'accepted') {
                    abort_if($lockedBooking->event_date->format('Y-m-d') < today()->format('Y-m-d'), 422, 'This event date has passed.');
                    if ($event) {
                        abort_if($event->bookings()->where('event_category_id', $lockedBooking->event_category_id)
                            ->whereIn('status', ['accepted', 'completed'])->where('id', '!=', $lockedBooking->id)->exists(),
                            422, 'Another vendor has already been accepted for this event category.');
                    }
                    VendorProfile::query()
                        ->whereKey($profile->id)
                        ->lockForUpdate()
                        ->firstOrFail();

                    $eventDate = $lockedBooking->event_date->format('Y-m-d');

                    $isBlocked = VendorBlockedDate::query()
                        ->where('vendor_profile_id', $profile->id)
                        ->whereDate('blocked_date', $eventDate)
                        ->exists();

                    if ($isBlocked) {
                        abort(422, 'This date has been blocked in availability.');
                    }

                    $hasAcceptedBooking = VendorBooking::query()
                        ->where('vendor_profile_id', $profile->id)
                        ->whereDate('event_date', $eventDate)
                        ->where('status', 'accepted')
                        ->where('id', '!=', $lockedBooking->id)
                        ->exists();

                    if ($hasAcceptedBooking) {
                        abort(422, 'Another booking has already been accepted for this date.');
                    }

                    $lockedBooking->update([
                        'status' => 'accepted',
                        'active_date_key' => $profile->id . ':' . $eventDate,
                        'event_category_key' => $event ? $event->id . ':' . $lockedBooking->event_category_id : null,
                        'status_updated_at' => now(),
                    ]);

                    if ($event) {
                        $event->update(['status' => 'Confirmed']);
                        $event->bookings()->where('event_category_id', $lockedBooking->event_category_id)
                            ->where('status', 'pending')->where('id', '!=', $lockedBooking->id)
                            ->update(['status' => 'rejected', 'status_updated_at' => now()]);
                    }

                    VendorBooking::query()
                        ->where('vendor_profile_id', $profile->id)
                        ->whereDate('event_date', $eventDate)
                        ->where('status', 'pending')
                        ->where('id', '!=', $lockedBooking->id)
                        ->update([
                            'status' => 'rejected',
                            'active_date_key' => null,
                            'status_updated_at' => now(),
                        ]);
                } else {
                    $lockedBooking->update([
                        'status' => $validated['status'],
                        'event_category_key' => $validated['status'] === 'completed' ? $lockedBooking->event_category_key : null,
                        'active_date_key' => null,
                        'status_updated_at' => now(),
                    ]);
                }

                if ($event && !$event->bookings()->whereIn('status', ['accepted', 'completed'])->exists()) {
                    $event->update(['status' => 'Planning']);
                }
                return $lockedBooking->fresh(['customer', 'vendorPackage']);
            }, 3);
        } catch (QueryException $exception) {
            if ((string) $exception->getCode() === '23000') {
                return response()->json([
                    'message' => 'Another booking has already been accepted for this date.',
                ], 422);
            }

            throw $exception;
        }

        return response()->json([
            'message' => 'Booking status updated successfully.',
            'booking' => $this->serializeBooking($booking),
        ]);
    }

    private function vendorProfileFor(Request $request): VendorProfile
    {
        abort_unless($request->user()->role === 'vendor', 403, 'Only vendors can manage bookings.');

        $profile = VendorProfile::where('user_id', $request->user()->id)->first();

        abort_unless($profile, 404, 'Vendor profile not found.');

        return $profile;
    }

    private function serializeBooking(VendorBooking $booking): array
    {
        return [
            'id' => $booking->id,
            'eventId' => $booking->event_id,
            'vendorId' => $booking->vendor_profile_id,
            'customerId' => $booking->customer_id,
            'clientName' => $booking->customer?->name,
            'clientEmail' => $booking->customer?->email,
            'eventDate' => $booking->event_date?->format('Y-m-d'),
            'eventType' => $booking->event_type,
            'guests' => $booking->guests,
            'packageId' => $booking->vendor_package_id,
            'packageName' => $booking->package_name,
            'packagePrice' => $booking->package_price,
            'status' => $booking->status,
            'createdAt' => $booking->created_at?->toISOString(),
            'statusUpdatedAt' => $booking->status_updated_at?->toISOString(),
            'rating' => null,
            'review' => null,
        ];
    }
}
