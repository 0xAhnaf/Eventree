<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function handleGoogleCallback(Request $request)
    {
        try {
            $request->validate([
                'access_token' => 'required|string',
            ]);

            $googleUser = Socialite::driver('google')
                ->userFromToken($request->access_token);

            $user = User::where('google_id', $googleUser->getId())
                ->orWhere('email', $googleUser->getEmail())
                ->first();

            // Existing user → login using the role already in database
            if ($user) {

                if (!$user->google_id) {
                    $user->update([
                        'google_id' => $googleUser->getId(),
                    ]);
                }

            } else {

                // New Google user → role is required for account creation
                $request->validate([
                    'role' => 'required|in:customer,vendor',
                ]);

                $user = User::create([
                    'name'      => $googleUser->getName(),
                    'email'     => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'role'      => $request->role,
                    'password'  => null,
                ]);
            }

            $token = $user->createToken('eventree_token')->plainTextToken;

            return response()->json([
                'user'  => $user,
                'token' => $token,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Google Authentication failed',
                'error'   => $e->getMessage(),
            ], 401);
        }
    }
}