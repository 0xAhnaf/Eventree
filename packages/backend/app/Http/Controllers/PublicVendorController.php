<?php

namespace App\Http\Controllers;

use App\Models\VendorProfile;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicVendorController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category' => ['nullable', 'string', 'max:255'],
            'max_price' => ['nullable', 'numeric', 'min:0'],
            'availability_date' => ['nullable', 'date'],
        ]);

        $query = VendorProfile::query()
            ->with(['user', 'category', 'images', 'amenities', 'packages'])
            ->whereNotNull('onboarding_completed_at')
            ->whereNotNull('registration_payment_completed_at')
            ->whereHas('user', fn (Builder $userQuery) => $userQuery->where('role', 'vendor'));

        if (! empty($validated['category'])) {
            $query->whereHas(
                'category',
                fn (Builder $categoryQuery) => $categoryQuery->where('name', $validated['category'])
            );
        }

        if (isset($validated['max_price'])) {
            $query->where(function (Builder $priceQuery) use ($validated) {
                $priceQuery
                    ->whereNull('starting_price')
                    ->orWhere('starting_price', '<=', $validated['max_price']);
            });
        }

        if (! empty($validated['availability_date'])) {
            $date = $validated['availability_date'];

            $query
                ->whereDoesntHave(
                    'blockedDates',
                    fn (Builder $blockedQuery) => $blockedQuery->whereDate('blocked_date', $date)
                )
                ->whereDoesntHave(
                    'bookings',
                    fn (Builder $bookingQuery) => $bookingQuery
                        ->whereDate('event_date', $date)
                        ->where('status', 'accepted')
                );
        }

        $vendors = $query
            ->orderBy('business_name')
            ->get()
            ->map(fn (VendorProfile $profile) => $this->serializeVendor($profile));

        return response()->json(['vendors' => $vendors]);
    }

    public function show(VendorProfile $vendorProfile): JsonResponse
    {
        $vendorProfile->load(['user', 'category', 'images', 'amenities', 'packages']);

        if (! $this->isPubliclyVisible($vendorProfile)) {
            return response()->json(['message' => 'Vendor not found.'], 404);
        }

        return response()->json([
            'vendor' => $this->serializeVendor($vendorProfile),
        ]);
    }

    public function availability(VendorProfile $vendorProfile): JsonResponse
    {
        $vendorProfile->loadMissing('user');

        if (! $this->isPubliclyVisible($vendorProfile)) {
            return response()->json(['message' => 'Vendor not found.'], 404);
        }

        return response()->json($this->availabilityPayload($vendorProfile));
    }

    private function serializeVendor(VendorProfile $profile): array
    {
        $coverImage = $profile->cover_image_id
            ? $profile->images->firstWhere('id', $profile->cover_image_id)
            : null;

        $coverImage ??= $profile->images->firstWhere('image_type', 'cover');

        $portfolio = $profile->images
            ->where('image_type', 'portfolio')
            ->sortBy('sort_order')
            ->values()
            ->map(fn ($image) => [
                'id' => $image->id,
                'url' => $image->image_url,
            ]);

        $galleryPhotos = collect([$coverImage?->image_url])
            ->filter()
            ->merge($portfolio->pluck('url'))
            ->unique()
            ->values();
        $firstPortfolio = $portfolio->first();

        return [
            'id' => $profile->id,
            'userId' => $profile->user_id,
            'name' => $profile->business_name,
            'description' => $profile->description,
            'category' => $profile->category?->name ?? '',
            'categoryId' => $profile->category_id,
            'location' => $profile->city,
            'fullAddress' => $profile->full_address,
            'businessEmail' => $profile->business_email,
            'phone' => $profile->phone,
            'website' => $profile->website,
            'managerName' => $profile->manager_name,
            'yearsExperience' => $profile->years_of_experience,
            'eventsCompleted' => $profile->events_completed,
            'startingPrice' => $profile->starting_price,
            'price' => $profile->starting_price !== null
                ? '৳' . number_format((float) $profile->starting_price, 0)
                : 'Price on request',
            'image' => $coverImage?->image_url ?? ($firstPortfolio['url'] ?? null),
            'photos' => $galleryPhotos,
            'portfolio' => $portfolio,
            'amenities' => $profile->amenities
                ->pluck('amenity_name')
                ->values(),
            'packages' => $profile->packages
                ->sortBy('sort_order')
                ->values()
                ->map(fn ($package) => [
                    'id' => $package->id,
                    'name' => $package->package_name,
                    'price' => $package->price,
                    'formattedPrice' => '৳' . number_format((float) $package->price, 0),
                    'features' => $package->description
                        ? array_values(array_filter(preg_split('/\r\n|\r|\n/', $package->description)))
                        : [],
                ]),
            // Review and admin-verification tables do not exist yet. Returning
            // neutral values prevents the public UI from presenting fake data.
            'rating' => null,
            'reviewCount' => 0,
            'reviews' => [],
            'verified' => false,
            'featured' => false,
        ];
    }

    private function availabilityPayload(VendorProfile $profile): array
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
            ->toBase();

        return [
            'vendor_id' => $profile->id,
            'blocked_dates' => $blockedDates->values(),
            'reserved_dates' => $reservedDates->unique()->values(),
            'unavailable_dates' => $blockedDates
                ->merge($reservedDates)
                ->unique()
                ->sort()
                ->values(),
        ];
    }

    private function isPubliclyVisible(VendorProfile $profile): bool
    {
        return $profile->user?->role === 'vendor'
            && $profile->onboarding_completed_at !== null
            && $profile->registration_payment_completed_at !== null;
    }
}
