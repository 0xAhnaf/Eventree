<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\VendorProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class MessageController extends Controller
{
    public function customerConversation(Request $request, VendorProfile $vendorProfile): JsonResponse
    {
        abort_unless($request->user()->role === 'customer', 403, 'Only customers can open vendor conversations.');
        abort_unless($this->vendorIsVisible($vendorProfile), 404, 'Vendor not found.');

        return $this->conversationResponse($request->user()->id, $vendorProfile, $vendorProfile->user_id);
    }

    public function sendToVendor(Request $request, VendorProfile $vendorProfile): JsonResponse
    {
        abort_unless($request->user()->role === 'customer', 403, 'Only customers can message vendors.');
        abort_unless($this->vendorIsVisible($vendorProfile), 404, 'Vendor not found.');

        $validated = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $message = Message::create([
            'vendor_profile_id' => $vendorProfile->id,
            'sender_id' => $request->user()->id,
            'recipient_id' => $vendorProfile->user_id,
            'body' => trim($validated['body']),
        ]);

        $message->load('sender');

        return response()->json(['message' => $this->serializeMessage($message, $request->user()->id)], 201);
    }

    public function vendorConversations(Request $request): JsonResponse
{
    $vendorProfile = $this->vendorProfileFor($request);
    $vendorUserId = $request->user()->id;

    $messages = Message::query()
        ->where('vendor_profile_id', $vendorProfile->id)
        ->where(function ($query) use ($vendorUserId) {
            $query->where('sender_id', $vendorUserId)
                ->orWhere('recipient_id', $vendorUserId);
        })
        ->with([
            'sender:id,name,email,role',
            'recipient:id,name,email,role',
        ])
        ->orderByDesc('created_at')
        ->get();

    $conversations = $messages
        ->filter(function (Message $message) use ($vendorUserId) {
            $other = $message->sender_id === $vendorUserId
                ? $message->recipient
                : $message->sender;

            return $other?->role === 'customer';
        })
        ->groupBy(function (Message $message) use ($vendorUserId) {
            return $message->sender_id === $vendorUserId
                ? $message->recipient_id
                : $message->sender_id;
        })
        ->map(function ($conversation, $customerId) use ($vendorUserId) {
            /** @var Message $latest */
            $latest = $conversation->first();

            $customer = $latest->sender_id === $vendorUserId
                ? $latest->recipient
                : $latest->sender;

            return [
                'customerId' => (int) $customerId,
                'customerName' => $customer?->name ?? 'Customer',
                'customerEmail' => $customer?->email ?? '',
                'lastMessage' => $latest->body,
                'lastMessageAt' => $latest->created_at?->toISOString(),
                'unreadCount' => $conversation
                    ->where('recipient_id', $vendorUserId)
                    ->whereNull('read_at')
                    ->count(),
            ];
        })
        ->values();

    return response()->json([
        'conversations' => $conversations,
    ]);
}
    public function vendorConversation(Request $request, int $customerId): JsonResponse
    {
        $vendorProfile = $this->vendorProfileFor($request);
        $this->customerUser($customerId);

        return $this->conversationResponse($request->user()->id, $vendorProfile, $customerId);
    }

    public function sendToCustomer(Request $request, int $customerId): JsonResponse
    {
        $vendorProfile = $this->vendorProfileFor($request);

        $validated = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $customer = $this->customerUser($customerId);

        $message = Message::create([
            'vendor_profile_id' => $vendorProfile->id,
            'sender_id' => $request->user()->id,
            'recipient_id' => $customer->id,
            'body' => trim($validated['body']),
        ]);

        $message->load('sender');

        return response()->json(['message' => $this->serializeMessage($message, $request->user()->id)], 201);
    }

    private function conversationResponse(int $currentUserId, VendorProfile $vendorProfile, int $otherUserId): JsonResponse
    {
        $messages = Message::query()
            ->where('vendor_profile_id', $vendorProfile->id)
            ->where(function ($query) use ($currentUserId, $otherUserId) {
                $query->where(function ($pair) use ($currentUserId, $otherUserId) {
                    $pair->where('sender_id', $currentUserId)->where('recipient_id', $otherUserId);
                })->orWhere(function ($pair) use ($currentUserId, $otherUserId) {
                    $pair->where('sender_id', $otherUserId)->where('recipient_id', $currentUserId);
                });
            })
            ->with('sender:id,name,email')
            ->orderBy('created_at')
            ->get();

        Message::query()
            ->where('vendor_profile_id', $vendorProfile->id)
            ->where('recipient_id', $currentUserId)
            ->where('sender_id', $otherUserId)
            ->whereNull('read_at')
            ->update(['read_at' => Carbon::now()]);

        $otherUser = \App\Models\User::find($otherUserId);

        return response()->json([
            'vendor' => [
                'id' => $vendorProfile->id,
                'name' => $vendorProfile->business_name,
                'managerName' => $vendorProfile->manager_name,
                'image' => optional($vendorProfile->coverImage)->image_url,
            ],
            'customer' => $otherUser ? [
                'id' => $otherUser->id,
                'name' => $otherUser->name,
                'email' => $otherUser->email,
            ] : null,
            'messages' => $messages->map(fn (Message $message) => $this->serializeMessage($message, $currentUserId))->values(),
        ]);
    }

    private function vendorProfileFor(Request $request): VendorProfile
    {
        abort_unless($request->user()->role === 'vendor', 403, 'Only vendors can access vendor messages.');

        $profile = VendorProfile::where('user_id', $request->user()->id)
            ->with('coverImage')
            ->first();

        abort_unless($profile, 404, 'Vendor profile not found.');

        return $profile;
    }

    private function vendorIsVisible(VendorProfile $vendorProfile): bool
    {
        $vendorProfile->loadMissing('user');

        return $vendorProfile->user?->role === 'vendor'
            && $vendorProfile->onboarding_completed_at !== null
            && $vendorProfile->registration_payment_completed_at !== null
            && $vendorProfile->admin_approved_at !== null;
    }

    private function customerUser(int $customerId): \App\Models\User
    {
        return \App\Models\User::where('id', $customerId)
            ->where('role', 'customer')
            ->firstOrFail();
    }

    private function serializeMessage(Message $message, int $currentUserId): array
    {
        return [
            'id' => $message->id,
            'body' => $message->body,
            'senderId' => $message->sender_id,
            'senderName' => $message->sender?->name ?? 'User',
            'isMine' => (int) $message->sender_id === (int) $currentUserId,
            'createdAt' => $message->created_at?->toISOString(),
            'readAt' => $message->read_at?->toISOString(),
        ];
    }
}
