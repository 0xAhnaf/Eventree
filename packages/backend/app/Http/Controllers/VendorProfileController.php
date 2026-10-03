<?php

namespace App\Http\Controllers;

use App\Models\VendorImage;
use App\Models\VendorProfile;
use Cloudinary\Api\Upload\UploadApi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VendorProfileController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'business_name' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'integer', 'exists:vendor_categories,id'],
            'description' => ['required', 'string'],

            'city' => ['required', 'string', 'max:255'],
            'full_address' => ['required', 'string'],
            'business_email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'website' => ['nullable', 'url', 'max:255'],
            'manager_name' => ['required', 'string', 'max:255'],

            'years_of_experience' => ['nullable', 'integer', 'min:0'],
            'events_completed' => ['nullable', 'integer', 'min:0'],
            'starting_price' => ['nullable', 'numeric', 'min:0'],

            // Images
            'cover_image' => ['nullable', 'image', 'max:5120'],
            'portfolio_images' => ['nullable', 'array'],
            'portfolio_images.*' => ['image', 'max:5120'],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Create Vendor Profile
        |--------------------------------------------------------------------------
        */

        $vendorProfile = VendorProfile::updateOrCreate([
            'user_id' => $request->user()->id,
        ], [
            'business_name' => $validated['business_name'],
            'category_id' => $validated['category_id'],
            'description' => $validated['description'],

            'city' => $validated['city'],
            'full_address' => $validated['full_address'],
            'business_email' => $validated['business_email'],
            'phone' => $validated['phone'],
            'website' => $validated['website'] ?? null,
            'manager_name' => $validated['manager_name'],

            'years_of_experience' => $validated['years_of_experience'] ?? null,
            'events_completed' => $validated['events_completed'] ?? null,
            'starting_price' => $validated['starting_price'] ?? null,
        ]);

        if ($vendorProfile->onboarding_completed_at === null) {
            $vendorProfile->forceFill([
                'onboarding_completed_at' => now(),
            ])->save();
        }

        // Sync phone number to the users table
        $request->user()->update([
            'phone' => $validated['phone'],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Cloudinary Upload API
        |--------------------------------------------------------------------------
        */

        $uploadApi = new UploadApi();

        /*
        |--------------------------------------------------------------------------
        | Upload Cover Image
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('cover_image')) {
            $existingCovers = $vendorProfile->images()
                ->where('image_type', 'cover')
                ->get();

            $result = $uploadApi->upload(
                $request->file('cover_image')->getRealPath(),
                [
                    'folder' => 'eventree/vendors/' . $vendorProfile->id . '/cover',
                ]
            );

            $coverImage = VendorImage::create([
                'vendor_profile_id' => $vendorProfile->id,
                'image_type' => 'cover',
                'image_url' => $result['secure_url'],
                'public_id' => $result['public_id'],
                'sort_order' => 0,
            ]);

            $vendorProfile->forceFill([
                'cover_image_id' => $coverImage->id,
            ])->save();

            foreach ($existingCovers as $existingCover) {
                try {
                    $uploadApi->destroy($existingCover->public_id);
                } catch (\Throwable $e) {
                    // The new cover is already stored, so stale remote cleanup
                    // must not make the profile update fail.
                }

                $existingCover->delete();
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Upload Portfolio Images
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('portfolio_images')) {
            foreach ($request->file('portfolio_images') as $index => $image) {
                $result = $uploadApi->upload(
                    $image->getRealPath(),
                    [
                        'folder' => 'eventree/vendors/' . $vendorProfile->id . '/portfolio',
                    ]
                );

                VendorImage::create([
                    'vendor_profile_id' => $vendorProfile->id,
                    'image_type' => 'portfolio',
                    'image_url' => $result['secure_url'],
                    'public_id' => $result['public_id'],
                    'sort_order' => $index,
                ]);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Return Complete Vendor Profile
        |--------------------------------------------------------------------------
        */

        $vendorProfile->load([
            'user',
            'category',
            'images',
            'amenities',
            'packages',
        ]);

        return response()->json([
            'message' => 'Vendor profile created successfully.',
            'vendor_profile' => $vendorProfile,
        ], 201);
    }

    public function show(Request $request): JsonResponse
    {
        $vendorProfile = VendorProfile::with([
            'user',
            'category',
            'images',
            'amenities',
            'packages',
        ])
        ->where('user_id', $request->user()->id)
        ->first();

        if (!$vendorProfile) {
            return response()->json([
                'message' => 'Vendor profile not found.',
            ], 404);
        }

        return response()->json([
            'vendor_profile' => $vendorProfile,
        ], 200);
    }

    public function update(Request $request): JsonResponse
    {
        $vendorProfile = VendorProfile::where('user_id', $request->user()->id)->first();

        if (!$vendorProfile) {
            return response()->json(['message' => 'Vendor profile not found.'], 404);
        }

        $validated = $request->validate([
            'business_name' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'integer', 'exists:vendor_categories,id'],
            'description' => ['required', 'string'],
            'city' => ['required', 'string', 'max:255'],
            'full_address' => ['required', 'string'],
            'business_email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'website' => ['nullable', 'url', 'max:255'],
            'manager_name' => ['required', 'string', 'max:255'],
            'years_of_experience' => ['nullable', 'integer', 'min:0'],
            'events_completed' => ['nullable', 'integer', 'min:0'],
            'starting_price' => ['nullable', 'numeric', 'min:0'],
        ]);

        $vendorProfile->update($validated);

        // Sync phone number to the users table
        $request->user()->update([
            'phone' => $validated['phone'],
        ]);

        $vendorProfile->load(['user', 'category', 'images', 'amenities', 'packages']);

        return response()->json([
            'message' => 'Vendor profile updated successfully.',
            'vendor_profile' => $vendorProfile,
        ], 200);
    }

    public function updateCoverImage(Request $request): JsonResponse
    {
        $vendorProfile = VendorProfile::where('user_id', $request->user()->id)->first();

        if (!$vendorProfile) {
            return response()->json(['message' => 'Vendor profile not found.'], 404);
        }

        $request->validate([
            'cover_image' => ['required', 'image', 'max:5120'],
        ]);

        $uploadApi = new UploadApi();
        $existingCovers = $vendorProfile->images()->where('image_type', 'cover')->get();

        $result = $uploadApi->upload(
            $request->file('cover_image')->getRealPath(),
            ['folder' => 'eventree/vendors/' . $vendorProfile->id . '/cover']
        );

        $coverImage = VendorImage::create([
            'vendor_profile_id' => $vendorProfile->id,
            'image_type' => 'cover',
            'image_url' => $result['secure_url'],
            'public_id' => $result['public_id'],
            'sort_order' => 0,
        ]);

        $vendorProfile->forceFill([
            'cover_image_id' => $coverImage->id,
        ])->save();

        foreach ($existingCovers as $existingCover) {
            try {
                $uploadApi->destroy($existingCover->public_id);
            } catch (\Throwable $e) {
                // The new cover is already stored, so stale remote cleanup
                // must not make the profile update fail.
            }

            $existingCover->delete();
        }

        return response()->json([
            'message' => 'Cover image updated successfully.',
            'image' => $coverImage,
        ], 200);
    }

    public function selectCoverImage(Request $request, VendorImage $image): JsonResponse
    {
        $vendorProfile = VendorProfile::where('user_id', $request->user()->id)->first();

        if (
            ! $vendorProfile
            || $image->vendor_profile_id !== $vendorProfile->id
            || $image->image_type !== 'portfolio'
        ) {
            return response()->json(['message' => 'Portfolio image not found.'], 404);
        }

        $vendorProfile->forceFill([
            'cover_image_id' => $image->id,
        ])->save();

        return response()->json([
            'message' => 'Cover image selected successfully.',
            'image' => $image,
        ], 200);
    }

    public function addPortfolioImages(Request $request): JsonResponse
    {
        $vendorProfile = VendorProfile::where('user_id', $request->user()->id)->first();

        if (!$vendorProfile) {
            return response()->json(['message' => 'Vendor profile not found.'], 404);
        }

        $request->validate([
            'portfolio_images' => ['required', 'array', 'min:1'],
            'portfolio_images.*' => ['image', 'max:5120'],
        ]);

        $uploadApi = new UploadApi();
        $nextSortOrder = (int) $vendorProfile->images()
            ->where('image_type', 'portfolio')
            ->max('sort_order');

        $createdImages = [];

        foreach ($request->file('portfolio_images') as $image) {
            $nextSortOrder++;
            $result = $uploadApi->upload(
                $image->getRealPath(),
                ['folder' => 'eventree/vendors/' . $vendorProfile->id . '/portfolio']
            );

            $createdImages[] = VendorImage::create([
                'vendor_profile_id' => $vendorProfile->id,
                'image_type' => 'portfolio',
                'image_url' => $result['secure_url'],
                'public_id' => $result['public_id'],
                'sort_order' => $nextSortOrder,
            ]);
        }

        return response()->json([
            'message' => 'Portfolio images added successfully.',
            'images' => $createdImages,
        ], 201);
    }

    public function deleteImage(Request $request, VendorImage $image): JsonResponse
    {
        $vendorProfile = VendorProfile::where('user_id', $request->user()->id)->first();

        if (!$vendorProfile || $image->vendor_profile_id !== $vendorProfile->id) {
            return response()->json(['message' => 'Image not found.'], 404);
        }

        if ((int) $vendorProfile->cover_image_id === (int) $image->id) {
            return response()->json([
                'message' => 'Choose another cover image before deleting this image.',
            ], 422);
        }

        $uploadApi = new UploadApi();

        try {
            $uploadApi->destroy($image->public_id);
        } catch (\Throwable $e) {
            // Continue even if Cloudinary cleanup fails; DB stays consistent below.
        }

        $image->delete();

        return response()->json(['message' => 'Image deleted successfully.'], 200);
    }

    public function dashboard(Request $request): JsonResponse
    {
        $profile = VendorProfile::where('user_id', $request->user()->id)->first();

        if (!$profile) {
            return response()->json(['message' => 'Vendor profile not found.'], 404);
        }

        $bookings = $profile->bookings()->get();

        $confirmedBookings = $bookings->where('status', 'completed');
        $totalRevenue = $confirmedBookings->sum('package_price');
        $pendingRequestsCount = $bookings->where('status', 'pending')->count();

        // Upcoming events (accepted bookings from today onward)
        $upcomingEvents = $profile->bookings()
            ->with('customer')
            ->where('status', 'accepted')
            ->whereDate('event_date', '>=', today())
            ->orderBy('event_date', 'asc')
            ->take(5)
            ->get();

        // Pending booking requests
        $bookingRequests = $profile->bookings()
            ->with('customer')
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $serializeBooking = function ($booking) {
            return [
                'id' => $booking->id,
                'eventId' => $booking->event_id,
                'vendorId' => $booking->vendor_profile_id,
                'customerId' => $booking->customer_id,
                'clientName' => $booking->customer?->name,
                'clientEmail' => $booking->customer?->email,
                'eventDate' => $booking->event_date instanceof \DateTimeInterface ? $booking->event_date->format('Y-m-d') : (string) $booking->event_date,
                'eventType' => $booking->event_type,
                'guests' => $booking->guests,
                'packageId' => $booking->vendor_package_id,
                'packageName' => $booking->package_name,
                'packagePrice' => $booking->package_price,
                'status' => $booking->status,
                'createdAt' => $booking->created_at?->toISOString(),
            ];
        };

        // Compute revenue chart by day of the week
        $daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        $startOfWeek = now()->startOfWeek();
        $endOfWeek = now()->endOfWeek();

        $weeklyRevenueByDay = [];
        foreach ($daysOfWeek as $day) {
            $weeklyRevenueByDay[$day] = 0.0;
        }

        $weeklyBookings = $confirmedBookings->filter(function ($b) use ($startOfWeek, $endOfWeek) {
            if (!$b->event_date) {
                return false;
            }
            $date = \Carbon\Carbon::parse($b->event_date);
            return $date->between($startOfWeek, $endOfWeek);
        });

        // Only use current week's bookings (no fallback to historical data)
        $sourceBookings = $weeklyBookings;

        foreach ($sourceBookings as $b) {
            if ($b->event_date) {
                $dayName = \Carbon\Carbon::parse($b->event_date)->format('D');
                if (isset($weeklyRevenueByDay[$dayName])) {
                    $weeklyRevenueByDay[$dayName] += (float) ($b->package_price ?? 0);
                }
            }
        }

        $maxRevenue = $weeklyRevenueByDay ? max(array_values($weeklyRevenueByDay)) : 0;

        $revenueChart = [];
        foreach ($daysOfWeek as $day) {
            $revenue = $weeklyRevenueByDay[$day];
            $height = $maxRevenue > 0 && $revenue > 0
                ? max(15, (int) round(($revenue / $maxRevenue) * 100))
                : 0;

            $revenueChart[] = [
                'day' => $day,
                'height' => $height,
                'revenue' => $revenue,
                'formatted_revenue' => '৳' . number_format($revenue, 2),
            ];
        }

        $highlightDay = now()->format('D');

        return response()->json([
            'stats' => [
                'total_revenue' => $totalRevenue,
                'confirmed_bookings' => $confirmedBookings->count(),
                'pending_requests' => $pendingRequestsCount,
                'events_completed' => $bookings->where('status', 'completed')->count(),
            ],
            'upcoming_events' => $upcomingEvents->map($serializeBooking),
            'booking_requests' => $bookingRequests->map($serializeBooking),
            'revenue_chart' => $revenueChart,
            'highlight_day' => $highlightDay,
        ]);
    }
}
