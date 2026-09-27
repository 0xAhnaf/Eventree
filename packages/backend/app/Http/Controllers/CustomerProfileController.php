<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CustomerProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        
        // Auto-create profile if missing for existing customer
        $profile = $user->customerProfile()->firstOrCreate([]);

        return response()->json([
            'user' => $user,
            'profile' => $profile,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => [
                'required',
                'string',
                'max:20',
                Rule::unique('users', 'phone')->ignore($user->id),
            ],
            'city' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'profile_image_url' => 'nullable|string',
            'profile_image_public_id' => 'nullable|string',
        ]);

        $user->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
        ]);

        $profile = $user->customerProfile()->firstOrCreate([]);
        $profile->update([
            'city' => $validated['city'] ?? null,
            'address' => $validated['address'] ?? null,
            'profile_image_url' => $validated['profile_image_url'] ?? $profile->profile_image_url,
            'profile_image_public_id' => $validated['profile_image_public_id'] ?? $profile->profile_image_public_id,
        ]);

        $user->profile_image_url = $profile->profile_image_url;

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
            'profile' => $profile,
        ]);
    }
}