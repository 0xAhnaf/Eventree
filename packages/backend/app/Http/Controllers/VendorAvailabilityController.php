<?php

namespace App\Http\Controllers;

use App\Models\VendorBlockedDate;
use App\Models\VendorProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VendorAvailabilityController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return response()->json($this->payload($this->vendorProfileFor($request)));
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'blocked_dates' => ['present', 'array'],
            'blocked_dates.*' => ['required', 'date', 'after_or_equal:today', 'distinct'],
        ]);

        $profile = $this->vendorProfileFor($request);
        $blockedDates = collect($validated['blocked_dates'])->unique()->sort()->values();

        $bookingConflicts = $profile->bookings()
            ->where('status', 'accepted')
            ->whereIn('event_date', $blockedDates)
            ->get(['event_date'])
            ->map(fn ($booking) => $booking->event_date->format('Y-m-d'));

        if ($bookingConflicts->isNotEmpty()) {
            return response()->json([
                'message' => 'Accepted booking dates cannot be manually blocked.',
                'conflicting_dates' => $bookingConflicts,
            ], 422);
        }

        DB::transaction(function () use ($profile, $blockedDates) {
            $profile->blockedDates()->delete();

            foreach ($blockedDates as $date) {
                VendorBlockedDate::create([
                    'vendor_profile_id' => $profile->id,
                    'blocked_date' => $date,
                ]);
            }
        });

        return response()->json([
            'message' => 'Availability saved successfully.',
            ...$this->payload($profile),
        ]);
    }

    private function vendorProfileFor(Request $request): VendorProfile
    {
        abort_unless($request->user()->role === 'vendor', 403, 'Only vendors can manage availability.');

        $profile = VendorProfile::where('user_id', $request->user()->id)->first();

        abort_unless($profile, 404, 'Vendor profile not found.');

        return $profile;
    }

    private function payload(VendorProfile $profile): array
    {
        $blockedDates = $profile->blockedDates()
            ->orderBy('blocked_date')
            ->get(['blocked_date'])
            ->map(fn ($blockedDate) => $blockedDate->blocked_date->format('Y-m-d'))
            ->toBase();

        $reservedDates = $profile->bookings()
            ->where('status', 'accepted')
            ->orderBy('event_date')
            ->get(['event_date'])
            ->map(fn ($booking) => $booking->event_date->format('Y-m-d'))
            ->toBase()
            ->unique()
            ->values();

        return [
            'vendor_id' => $profile->id,
            'blocked_dates' => $blockedDates->values(),
            'reserved_dates' => $reservedDates,
            'unavailable_dates' => $blockedDates
                ->merge($reservedDates)
                ->unique()
                ->sort()
                ->values(),
        ];
    }
}
