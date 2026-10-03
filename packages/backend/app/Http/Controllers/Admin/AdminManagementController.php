<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\VendorBooking;
use App\Models\VendorProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminManagementController extends Controller
{
    private const REGISTRATION_FEE = 500;

    public function dashboard(): JsonResponse
    {
        $metrics = $this->metrics();

        $recentPayments = VendorProfile::query()
            ->with(['user:id,name,email', 'category:id,name'])
            ->whereNotNull('registration_payment_completed_at')
            ->latest('registration_payment_completed_at')
            ->limit(5)
            ->get()
            ->map(fn (VendorProfile $profile) => $this->serializePayment($profile));

        $vendorWatchlist = VendorProfile::query()
            ->with(['user:id,name,email', 'category:id,name'])
            ->withCount('bookings')
            ->withSum([
                'bookings as booking_revenue' => fn ($query) => $query
                    ->whereIn('status', ['accepted', 'completed']),
            ], 'package_price')
            ->whereNotNull('registration_payment_completed_at')
            ->whereNotNull('admin_approved_at')
            ->orderByDesc('bookings_count')
            ->orderBy('business_name')
            ->limit(5)
            ->get()
            ->map(fn (VendorProfile $profile) => [
                'id' => $profile->id,
                'businessName' => $profile->business_name,
                'category' => $profile->category?->name ?? 'Uncategorized',
                'bookings' => $profile->bookings_count,
                'revenue' => (float) ($profile->booking_revenue ?? 0),
                'approvalStatus' => 'approved',
            ]);

        return response()->json([
            'metrics' => $metrics,
            'monthlyRevenue' => $this->monthlyRevenue(),
            'recentPayments' => $recentPayments,
            'vendorWatchlist' => $vendorWatchlist,
        ]);
    }

    public function customers(): JsonResponse
    {
        $customers = User::query()
            ->where('role', 'customer')
            ->withCount('vendorBookings')
            ->latest()
            ->get()
            ->map(fn (User $customer) => [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'joinedAt' => $customer->created_at?->toDateString(),
                'bookings' => $customer->vendor_bookings_count,
                'status' => 'active',
            ]);

        return response()->json(['customers' => $customers]);
    }

    public function destroyCustomer(User $customer): JsonResponse
    {
        abort_unless($customer->role === 'customer', 404, 'Customer not found.');

        $customer->tokens()->delete();
        $customer->delete();

        return response()->json(['message' => 'Customer deleted successfully.']);
    }

    public function vendors(): JsonResponse
    {
        $vendors = VendorProfile::query()
            ->with(['user:id,name,email,phone', 'category:id,name'])
            ->withCount('bookings')
            ->whereNotNull('registration_payment_completed_at')
            ->latest('registration_payment_completed_at')
            ->get()
            ->map(fn (VendorProfile $profile) => $this->serializeVendor($profile));

        return response()->json(['vendors' => $vendors]);
    }

    public function approveVendor(VendorProfile $vendor): JsonResponse
    {
        abort_unless(
            $vendor->registration_payment_completed_at !== null,
            422,
            'The vendor must complete registration payment before approval.'
        );

        $vendor->forceFill(['admin_approved_at' => $vendor->admin_approved_at ?? now()])->save();

        return response()->json([
            'message' => 'Vendor approved successfully.',
            'vendor' => $this->serializeVendor($vendor->load(['user', 'category'])),
        ]);
    }

    public function destroyVendor(VendorProfile $vendor): JsonResponse
    {
        DB::transaction(function () use ($vendor) {
            $user = $vendor->user;

            if ($user) {
                $user->tokens()->delete();
                $user->delete();
            } else {
                $vendor->delete();
            }
        });

        return response()->json(['message' => 'Vendor deleted successfully.']);
    }

    public function bookings(): JsonResponse
    {
        $bookings = VendorBooking::query()
            ->with([
                'customer:id,name,email,phone',
                'vendorProfile:id,user_id,business_name,category_id',
                'vendorProfile.category:id,name',
            ])
            ->latest()
            ->get()
            ->map(fn (VendorBooking $booking) => [
                'id' => $booking->id,
                'vendorName' => $booking->vendorProfile?->business_name,
                'customerName' => $booking->customer?->name,
                'customerEmail' => $booking->customer?->email,
                'eventDate' => $booking->event_date?->format('Y-m-d'),
                'eventType' => $booking->event_type,
                'guests' => $booking->guests,
                'packageName' => $booking->package_name,
                'amount' => $booking->package_price !== null
                    ? (float) $booking->package_price
                    : null,
                'status' => $booking->status,
                'createdAt' => $booking->created_at?->toISOString(),
            ]);

        return response()->json(['bookings' => $bookings]);
    }

    public function payments(): JsonResponse
    {
        $profiles = VendorProfile::query()
            ->with(['user:id,name,email', 'category:id,name'])
            ->whereNotNull('registration_payment_completed_at')
            ->latest('registration_payment_completed_at')
            ->get();

        return response()->json([
            'summary' => [
                'completedPayments' => $profiles->count(),
                'totalRevenue' => $profiles->count() * self::REGISTRATION_FEE,
                'registrationFee' => self::REGISTRATION_FEE,
            ],
            'payments' => $profiles
                ->map(fn (VendorProfile $profile) => $this->serializePayment($profile))
                ->values(),
        ]);
    }

    public function reports(): JsonResponse
    {
        $bookingStatuses = VendorBooking::query()
            ->select('status', DB::raw('COUNT(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        return response()->json([
            'metrics' => $this->metrics(),
            'monthlyRevenue' => $this->monthlyRevenue(),
            'bookingStatuses' => [
                'pending' => (int) ($bookingStatuses['pending'] ?? 0),
                'accepted' => (int) ($bookingStatuses['accepted'] ?? 0),
                'rejected' => (int) ($bookingStatuses['rejected'] ?? 0),
                'completed' => (int) ($bookingStatuses['completed'] ?? 0),
            ],
        ]);
    }

    private function metrics(): array
    {
        $paidVendors = VendorProfile::query()
            ->whereNotNull('registration_payment_completed_at')
            ->count();

        return [
            'totalRevenue' => $paidVendors * self::REGISTRATION_FEE,
            'totalBookings' => VendorBooking::query()->count(),
            'activeVendors' => VendorProfile::query()
                ->whereNotNull('registration_payment_completed_at')
                ->whereNotNull('admin_approved_at')
                ->count(),
            'pendingApprovals' => VendorProfile::query()
                ->whereNotNull('registration_payment_completed_at')
                ->whereNull('admin_approved_at')
                ->count(),
            'totalCustomers' => User::query()->where('role', 'customer')->count(),
            'paidVendors' => $paidVendors,
        ];
    }

    private function monthlyRevenue(): array
    {
        $start = now()->startOfMonth()->subMonths(5);

        $counts = VendorProfile::query()
            ->whereNotNull('registration_payment_completed_at')
            ->where('registration_payment_completed_at', '>=', $start)
            ->selectRaw("DATE_FORMAT(registration_payment_completed_at, '%Y-%m') as month_key, COUNT(*) as total")
            ->groupBy('month_key')
            ->pluck('total', 'month_key');

        return collect(range(0, 5))
            ->map(function (int $offset) use ($start, $counts) {
                $month = $start->copy()->addMonths($offset);
                $count = (int) ($counts[$month->format('Y-m')] ?? 0);

                return [
                    'month' => $month->format('M'),
                    'monthKey' => $month->format('Y-m'),
                    'revenue' => $count * self::REGISTRATION_FEE,
                ];
            })
            ->values()
            ->all();
    }

    private function serializeVendor(VendorProfile $profile): array
    {
        return [
            'id' => $profile->id,
            'businessName' => $profile->business_name,
            'ownerName' => $profile->user?->name,
            'email' => $profile->business_email ?: $profile->user?->email,
            'phone' => $profile->phone ?: $profile->user?->phone,
            'category' => $profile->category?->name ?? 'Uncategorized',
            'location' => $profile->city,
            'paymentStatus' => 'paid',
            'approvalStatus' => $profile->admin_approved_at ? 'approved' : 'pending',
            'paymentCompletedAt' => $profile->registration_payment_completed_at?->toISOString(),
            'approvedAt' => $profile->admin_approved_at?->toISOString(),
            'joinedAt' => $profile->created_at?->toDateString(),
            'bookings' => $profile->bookings_count ?? $profile->bookings()->count(),
        ];
    }

    private function serializePayment(VendorProfile $profile): array
    {
        return [
            'id' => $profile->id,
            'vendorId' => $profile->id,
            'businessName' => $profile->business_name,
            'ownerName' => $profile->user?->name,
            'email' => $profile->user?->email,
            'category' => $profile->category?->name ?? 'Uncategorized',
            'amount' => self::REGISTRATION_FEE,
            'status' => 'completed',
            'paidAt' => $profile->registration_payment_completed_at?->toISOString(),
        ];
    }
}
