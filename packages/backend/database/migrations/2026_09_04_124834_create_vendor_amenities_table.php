<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vendor_amenities', function (Blueprint $table) {
            $table->id();

            $table->foreignId('vendor_profile_id')
                ->constrained('vendor_profiles')
                ->cascadeOnDelete();

            $table->string('amenity_name');

            $table->timestamps();

            // Prevent the same amenity from being added twice
            $table->unique(['vendor_profile_id', 'amenity_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendor_amenities');
    }
};