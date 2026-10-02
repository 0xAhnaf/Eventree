<?php

namespace App\Services\Rag;

use App\Models\VendorProfile;

class VendorKnowledgeService
{
    public function getVendors(array $filters = []): array
    {
        $query = VendorProfile::with([
            'category',
            'amenities',
            'packages',
            'ratings',
        ]);

        // Filter by minimum rating.
       if (isset($filters['min_rating'])) {
    $minRating = (float) $filters['min_rating'];

    $query->whereHas('ratings')
        ->withAvg('ratings', 'rating')
        ->whereRaw(
            '(SELECT AVG(vr.rating)
              FROM vendor_ratings vr
              WHERE vr.vendor_profile_id = vendor_profiles.id) >= ?',
            [$minRating]
        );
}

        // Filter by category.
        if (!empty($filters['category'])) {
            $category = $filters['category'];

            $query->whereHas('category', function ($categoryQuery) use ($category) {
                $categoryQuery->where('name', 'LIKE', "%{$category}%");
            });
        }

        // Filter by city.
        if (!empty($filters['city'])) {
            $query->where('city', 'LIKE', "%{$filters['city']}%");
        }

        // Filter by amenity.
        if (!empty($filters['amenity'])) {
            $amenity = $filters['amenity'];

            $query->whereHas('amenities', function ($amenityQuery) use ($amenity) {
                $amenityQuery->where(
                    'amenity_name',
                    'LIKE',
                    "%{$amenity}%"
                );
            });
        }

        // Filter by vendor name.
        if (!empty($filters['vendor_name'])) {
            $vendorName = $filters['vendor_name'];

            $query->where(
                'business_name',
                'LIKE',
                "%{$vendorName}%"
            );
        }

        $vendors = $query->get();

        return $vendors->map(function ($vendor) {
            $ratings = $vendor->ratings;

            $averageRating = $ratings->count() > 0
                ? round($ratings->avg('rating'), 1)
                : 0;

            return [
                'id' => $vendor->id,
                'name' => $vendor->business_name,
                'category' => $vendor->category?->name,
                'description' => $vendor->description,
                'city' => $vendor->city,
                'address' => $vendor->full_address,
                'starting_price' => $vendor->starting_price,
                'average_rating' => $averageRating,
                'review_count' => $ratings->count(),

                'amenities' => $vendor->amenities
                    ->pluck('amenity_name')
                    ->values()
                    ->toArray(),

                'packages' => $vendor->packages->map(function ($package) {
                    return [
                        'name' => $package->package_name,
                        'description' => $package->description,
                        'price' => $package->price,
                    ];
                })->values()->toArray(),
            ];
        })->values()->toArray();
    }
}