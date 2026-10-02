<?php

namespace App\Http\Controllers;

use App\Models\UserNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifications = UserNotification::query()
            ->where('recipient_id', $request->user()->id)
            ->latest()
            ->limit(30)
            ->get()
            ->map(fn (UserNotification $notification) => $this->serialize($notification));

        $unreadCount = UserNotification::query()
            ->where('recipient_id', $request->user()->id)
            ->whereNull('read_at')
            ->count();

        return response()->json([
            'notifications' => $notifications,
            'unreadCount' => $unreadCount,
        ]);
    }

    public function summary(Request $request): JsonResponse
    {
        $user = $request->user();
        $unreadCount = UserNotification::query()
            ->where('recipient_id', $user->id)
            ->whereNull('read_at')
            ->count();

        $payload = ['unreadCount' => $unreadCount];

        if ($user->role === 'vendor') {
            $payload['pendingBookingCount'] = $user->vendorProfile
                ? $user->vendorProfile->bookings()->where('status', 'pending')->count()
                : 0;
        }

        if ($user->role === 'admin') {
            $payload['pendingVendorApprovalCount'] = \App\Models\VendorProfile::query()
                ->whereNotNull('registration_payment_completed_at')
                ->whereNull('admin_approved_at')
                ->count();
        }

        return response()->json($payload);
    }

    public function markRead(Request $request, int $notification): JsonResponse
    {
        $item = UserNotification::query()
            ->whereKey($notification)
            ->where('recipient_id', $request->user()->id)
            ->firstOrFail();

        $item->update(['read_at' => $item->read_at ?? now()]);

        return response()->json(['notification' => $this->serialize($item->refresh())]);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        UserNotification::query()
            ->where('recipient_id', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'Notifications marked as read.']);
    }

    private function serialize(UserNotification $notification): array
    {
        return [
            'id' => $notification->id,
            'type' => $notification->type,
            'message' => $notification->message,
            'relatedType' => $notification->related_type,
            'relatedId' => $notification->related_id,
            'read' => $notification->read_at !== null,
            'createdAt' => $notification->created_at?->toISOString(),
            'readAt' => $notification->read_at?->toISOString(),
        ];
    }
}
