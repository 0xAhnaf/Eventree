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
    $request->validate([
        'access_token' => 'required|string',
'role' => 'required|in:customer,vendor',    ]);

    try {
        $googleUser = Socialite::driver('google')
            ->userFromToken($request->access_token);

        $user = User::where('google_id', $googleUser->getId())
            ->orWhere('email', $googleUser->getEmail())
            ->first();

        if (!$user) {
            $user = User::create([
                'name'      => $googleUser->getName(),
                'email'     => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'role'      => $request->role,
                'password'  => null,
            ]);
        } else {
            if (!$user->google_id) {
                $user->update([
                    'google_id' => $googleUser->getId(),
                ]);
            }
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