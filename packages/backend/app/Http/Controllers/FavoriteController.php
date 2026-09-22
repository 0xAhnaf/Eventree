<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Favorite;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $favorites = $request->user()
            ->favorites()
            ->with([
                'vendorProfile.category',
                'vendorProfile.images',
            ])
            ->get();

        return response()->json($favorites);
    }

    public function toggle(Request $request)
    {
        $request->validate([
            'vendor_id' => 'required|exists:vendor_profiles,id',
        ]);

        $userId = $request->user()->id;
        $vendorId = $request->vendor_id;

        $favorite = Favorite::where('user_id', $userId)
            ->where('vendor_id', $vendorId)
            ->first();

        if ($favorite) {
            $favorite->delete();

            return response()->json([
                'favorited' => false,
                'message' => 'Removed from favorites',
            ]);
        }

        Favorite::create([
            'user_id' => $userId,
            'vendor_id' => $vendorId,
        ]);

        return response()->json([
            'favorited' => true,
            'message' => 'Added to favorites',
        ]);
    }
}