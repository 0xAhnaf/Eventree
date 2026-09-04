<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vendor_profiles', function (Blueprint $table) {
            $table->id();

            // The user who owns this vendor profile
            $table->foreignId('user_id')
                ->unique()
                ->constrained('users')
                ->cascadeOnDelete();

            // Step 1: Business information
            $table->string('business_name');
            $table->foreignId('category_id')
                ->constrained('vendor_categories')
                ->restrictOnDelete();
            $table->text('description');

            // Step 2: Location and contact
            $table->string('city');
            $table->text('full_address');
            $table->string('business_email');
            $table->string('phone', 30);
            $table->string('website')->nullable();
            $table->string('manager_name');

            // Step 3: Profile highlights
            $table->unsignedInteger('years_of_experience')->nullable();
            $table->unsignedInteger('events_completed')->nullable();
            $table->decimal('starting_price', 12, 2)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendor_profiles');
    }
};