<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vendor_images', function (Blueprint $table) {
            $table->id();

            $table->foreignId('vendor_profile_id')
                ->constrained('vendor_profiles')
                ->cascadeOnDelete();

            // cover or portfolio
            $table->enum('image_type', ['cover', 'portfolio']);

            // Cloudinary URL
            $table->text('image_url');

            // Cloudinary public ID
            $table->string('public_id')->unique();

            // Controls portfolio image ordering
            $table->unsignedInteger('sort_order')->default(0);

            $table->timestamps();

            $table->index(['vendor_profile_id', 'image_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendor_images');
    }
};