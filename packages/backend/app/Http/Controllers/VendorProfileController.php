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
            $result = $uploadApi->upload(
                $request->file('cover_image')->getRealPath(),
                [
                    'folder' => 'eventree/vendors/' . $vendorProfile->id . '/cover',
                ]
            );

            VendorImage::create([
                'vendor_profile_id' => $vendorProfile->id,
                'image_type' => 'cover',
                'image_url' => $result['secure_url'],
                'public_id' => $result['public_id'],
                'sort_order' => 0,
            ]);
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
        $existingCover = $vendorProfile->images()->where('image_type', 'cover')->first();

        if ($existingCover) {
            try {
                $uploadApi->destroy($existingCover->public_id);
            } catch (\Throwable $e) {
                // Continue even if Cloudinary cleanup fails; DB stays consistent below.
            }
            $existingCover->delete();
        }

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

        return response()->json([
            'message' => 'Cover image updated successfully.',
            'image' => $coverImage,
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

        $uploadApi = new UploadApi();

        try {
            $uploadApi->destroy($image->public_id);
        } catch (\Throwable $e) {
            // Continue even if Cloudinary cleanup fails; DB stays consistent below.
        }

        $image->delete();

        return response()->json(['message' => 'Image deleted successfully.'], 200);
    }
}