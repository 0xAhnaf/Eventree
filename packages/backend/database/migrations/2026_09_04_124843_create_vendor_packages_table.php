<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vendor_packages', function (Blueprint $table) {
            $table->id();

            $table->foreignId('vendor_profile_id')
                ->constrained('vendor_profiles')
                ->cascadeOnDelete();

            $table->string('package_name');
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2);

            // Determines the display order
            $table->unsignedTinyInteger('sort_order')->default(0);

            $table->timestamps();

            $table->index('vendor_profile_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendor_packages');
    }
};