<?php

namespace App\Http\Controllers;

use App\Models\VendorProfile;
use App\Models\VendorRating;
use App\Models\VendorReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VendorReviewController extends Controller
{
    public function storeRating(Request $request, VendorProfile $vendor)
    {
        $request->validate([
            'rating' => 'required|numeric|min:1|max:5',
        ]);

        $rating = VendorRating::updateOrCreate(
            [
                'vendor_profile_id' => $vendor->id,
                'user_id' => Auth::id(),
            ],
            [
                'rating' => $request->rating,
            ]
        );

        return response()->json([
            'message' => 'Rating submitted successfully',
            'rating' => $rating,
        ]);
    }


    public function storeReview(Request $request, VendorProfile $vendor)
    {
        $request->validate([
            'comment' => 'required|string',
        ]);

        $review = VendorReview::create([
            'vendor_profile_id' => $vendor->id,
            'user_id' => Auth::id(),
            'comment' => $request->comment,
        ]);

        return response()->json([
            'message' => 'Review submitted successfully',
            'review' => $review,
        ]);
    }


    public function updateReview(Request $request, VendorReview $review)
    {
        if ($review->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'comment' => 'required|string',
        ]);

        $review->update([
            'comment' => $request->comment,
        ]);

        return response()->json([
            'message' => 'Review updated successfully',
            'review' => $review,
        ]);
    }


    public function deleteReview(VendorReview $review)
    {
        if ($review->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $review->delete();

        return response()->json([
            'message' => 'Review deleted successfully'
        ]);
    }


    public function getReviews(VendorProfile $vendor)
    {
        $reviews = $vendor->reviews()
            ->with('user:id,name')
            ->latest()
            ->get();

        $averageRating = $vendor->ratings()
            ->avg('rating');

        return response()->json([
            'average_rating' => round($averageRating ?? 0, 1),
            'total_reviews' => $reviews->count(),
            'reviews' => $reviews,
        ]);
    }
}