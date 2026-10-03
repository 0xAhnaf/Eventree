<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vendor_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_profile_id')
                ->constrained('vendor_profiles')
                ->cascadeOnDelete();
            $table->foreignId('customer_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->foreignId('vendor_package_id')
                ->nullable()
                ->constrained('vendor_packages')
                ->nullOnDelete();

            $table->date('event_date');
            $table->string('event_type');
            $table->unsignedInteger('guests');
            $table->string('package_name')->nullable();
            $table->decimal('package_price', 12, 2)->nullable();
            $table->enum('status', ['pending', 'accepted', 'rejected', 'completed'])
                ->default('pending');

            // Only active reservations have a key. Its unique index prevents
            // concurrent requests from reserving the same vendor and date.
            $table->string('active_date_key')->nullable()->unique();
            $table->timestamp('status_updated_at')->nullable();
            $table->timestamps();

            $table->index(['vendor_profile_id', 'event_date']);
            $table->index(['vendor_profile_id', 'status']);
            $table->index(['customer_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendor_bookings');
    }
};
