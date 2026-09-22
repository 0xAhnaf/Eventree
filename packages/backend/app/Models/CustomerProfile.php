<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerProfile extends Model
{
    protected $fillable = [
        'user_id',
        'city',
        'address',
        'profile_image_url',
        'profile_image_public_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}