<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VendorRating extends Model
{
    use HasFactory;

    protected $fillable = [
        'vendor_profile_id',
        'user_id',
        'rating',
    ];

    public function vendorProfile()
    {
        return $this->belongsTo(VendorProfile::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}