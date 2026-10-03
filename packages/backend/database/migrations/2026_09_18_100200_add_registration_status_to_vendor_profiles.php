<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vendor_profiles', function (Blueprint $table) {
            $table->timestamp('onboarding_completed_at')->nullable()->after('starting_price');
            $table->timestamp('registration_payment_completed_at')->nullable()->after('onboarding_completed_at');

            $table->index(
                ['onboarding_completed_at', 'registration_payment_completed_at'],
                'vendor_profiles_public_status_index'
            );
        });

        // Pending requests no longer reserve a date. Only accepted bookings
        // keep the unique active-date key.
        DB::table('vendor_bookings')
            ->where('status', 'pending')
            ->update(['active_date_key' => null]);
    }

    public function down(): void
    {
        Schema::table('vendor_profiles', function (Blueprint $table) {
            $table->dropIndex('vendor_profiles_public_status_index');
            $table->dropColumn([
                'onboarding_completed_at',
                'registration_payment_completed_at',
            ]);
        });
    }
};
