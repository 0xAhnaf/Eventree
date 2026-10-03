<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vendor_profiles', function (Blueprint $table) {
            $table->timestamp('admin_approved_at')
                ->nullable()
                ->after('registration_payment_completed_at');

            $table->index(
                ['registration_payment_completed_at', 'admin_approved_at'],
                'vendor_profiles_admin_status_index'
            );
        });
    }

    public function down(): void
    {
        Schema::table('vendor_profiles', function (Blueprint $table) {
            $table->dropIndex('vendor_profiles_admin_status_index');
            $table->dropColumn('admin_approved_at');
        });
    }
};
