<?php

namespace App\Http\Controllers;

use App\Models\VendorAmenity;
use App\Models\VendorPackage;
use App\Models\VendorProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VendorDetailsController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amenities' => ['nullable', 'array'],
            'amenities.*' => ['required', 'string', 'max:255'],

            'packages' => ['nullable', 'array', 'max:3'],
            'packages.*.package_name' => ['required', 'string', 'max:255'],
            'packages.*.description' => ['nullable', 'string'],
            'packages.*.price' => ['required', 'numeric', 'min:0'],
        ]);

        $vendorProfile = VendorProfile::where(
            'user_id',
            $request->user()->id
        )->first();

        if (!$vendorProfile) {
            return response()->json([
                'message' => 'Vendor profile not found.',
            ], 404);
        }

        DB::transaction(function () use ($validated, $vendorProfile) {

            // Save amenities
            if (!empty($validated['amenities'])) {
                foreach ($validated['amenities'] as $amenity) {
                    VendorAmenity::updateOrCreate(
                        [
                            'vendor_profile_id' => $vendorProfile->id,
                            'amenity_name' => $amenity,
                        ],
                        [
                            'amenity_name' => $amenity,
                        ]
                    );
                }
            }

            // Save packages
            if (!empty($validated['packages'])) {
                foreach ($validated['packages'] as $index => $package) {
                    VendorPackage::updateOrCreate(
                        [
                            'vendor_profile_id' => $vendorProfile->id,
                            'sort_order' => $index,
                        ],
                        [
                            'package_name' => $package['package_name'],
                            'description' => $package['description'] ?? null,
                            'price' => $package['price'],
                            'sort_order' => $index,
                        ]
                    );
                }
            }
        });

        return response()->json([
            'message' => 'Vendor amenities and packages saved successfully.',
            'amenities' => $vendorProfile->amenities()->get(),
            'packages' => $vendorProfile->packages()
                ->orderBy('sort_order')
                ->get(),
        ], 201);
    }
}