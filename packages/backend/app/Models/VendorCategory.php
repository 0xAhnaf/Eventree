<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VendorCategory extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    public function vendorProfiles(): HasMany
    {
        return $this->hasMany(VendorProfile::class, 'category_id');
    }
}