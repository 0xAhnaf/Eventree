<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vendor_blocked_dates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_profile_id')
                ->constrained('vendor_profiles')
                ->cascadeOnDelete();
            $table->date('blocked_date');
            $table->timestamps();

            $table->unique(['vendor_profile_id', 'blocked_date']);
            $table->index('blocked_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendor_blocked_dates');
    }
};
