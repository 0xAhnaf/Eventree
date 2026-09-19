<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::table('events', fn (Blueprint $table) => $table->timestamp('completed_at')->nullable());
        Schema::table('vendor_bookings', function (Blueprint $table) {
            $table->foreignId('event_id')->nullable()->constrained('events')->nullOnDelete();
            $table->unsignedBigInteger('event_category_id')->nullable();
            $table->string('event_category_key')->nullable()->unique();
            $table->index(['event_id', 'event_category_id', 'status'], 'booking_event_category_status');
        });
    }
    public function down(): void {
        Schema::table('vendor_bookings', function (Blueprint $table) {
            $table->dropIndex('booking_event_category_status');
            $table->dropUnique(['event_category_key']);
            $table->dropForeign(['event_id']);
            $table->dropColumn(['event_id', 'event_category_id', 'event_category_key']);
        });
        Schema::table('events', fn (Blueprint $table) => $table->dropColumn('completed_at'));
    }
};
