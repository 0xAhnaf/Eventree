<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vendor_profiles', function (Blueprint $table) {
            $table->foreignId('cover_image_id')
                ->nullable()
                ->after('registration_payment_completed_at')
                ->constrained('vendor_images')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('vendor_profiles', function (Blueprint $table) {
            $table->dropConstrainedForeignId('cover_image_id');
        });
    }
};
