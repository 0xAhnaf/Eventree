<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserNotification;
use App\Models\VendorBooking;
use App\Models\VendorProfile;
use Illuminate\Support\Collection;

class NotificationService
{
    public function create(
        int $recipientId,
        string $type,
        string $message,
        ?string $relatedType = null,
        ?int $relatedId = null,
    ): UserNotification {
        return UserNotification::create([
            'recipient_id' => $recipientId,
            'type' => $type,
            'message' => $message,
            'related_type' => $relatedType,
            'related_id' => $relatedId,
        ]);
    }

    public function bookingRequest(VendorBooking $booking): UserNotification
    {
        $booking->loadMissing(['customer', 'event']);

        $customerName = $booking->customer?->name ?? 'A customer';
        $eventLabel = $booking->event_type ?: 'event';
        $date = $booking->event_date?->format('d M Y');
        $message = sprintf(
            '%s has sent you a booking request for %s%s.',
            $customerName,
            $eventLabel,
            $date ? " on {$date}" : ''
        );

        return $this->create(
            $booking->vendorProfile()->with('user')->firstOrFail()->user_id,
            'booking_request',
            $message,
            'vendor_booking',
            $booking->id,
        );
    }

    public function bookingAccepted(VendorBooking $booking): UserNotification
    {
        $booking->loadMissing(['vendorProfile', 'event']);
        $vendorName = $booking->vendorProfile?->business_name ?? 'The vendor';
        $eventLabel = $booking->event_type ?: 'event';
        $date = $booking->event_date?->format('d M Y');

        return $this->create(
            $booking->customer_id,
            'booking_accepted',
            "Your booking request with {$vendorName} for {$eventLabel}" . ($date ? " on {$date}" : '') . ' has been accepted.',
            'vendor_booking',
            $booking->id,
        );
    }

    public function bookingRejected(VendorBooking $booking, bool $becauseAnotherVendorWasAccepted = false): UserNotification
    {
        $booking->loadMissing(['vendorProfile', 'event']);
        $vendorName = $booking->vendorProfile?->business_name ?? 'the vendor';
        $eventLabel = $booking->event_type ?: 'event';
        $date = $booking->event_date?->format('d M Y');
        $suffix = $becauseAnotherVendorWasAccepted
            ? ' Another vendor was accepted for this event.'
            : '';

        return $this->create(
            $booking->customer_id,
            'booking_rejected',
            "Your booking request with {$vendorName} for {$eventLabel}" . ($date ? " on {$date}" : '') . ' has been rejected.' . $suffix,
            'vendor_booking',
            $booking->id,
        );
    }

    public function vendorPendingApproval(VendorProfile $profile): Collection
    {
        $message = sprintf(
            '%s has completed registration payment and is waiting for admin approval.',
            $profile->business_name ?: ($profile->user?->name ?? 'A vendor')
        );

        return User::query()
            ->where('role', 'admin')
            ->get(['id'])
            ->map(fn (User $admin) => $this->create(
                $admin->id,
                'vendor_pending_approval',
                $message,
                'vendor_profile',
                $profile->id,
            ));
    }

    public function markBookingRequestRead(int $bookingId): void
    {
        UserNotification::query()
            ->where('type', 'booking_request')
            ->where('related_type', 'vendor_booking')
            ->where('related_id', $bookingId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }
}
