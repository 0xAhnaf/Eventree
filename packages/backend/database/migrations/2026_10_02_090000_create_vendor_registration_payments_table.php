<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vendor_registration_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_profile_id')
                ->constrained('vendor_profiles')
                ->cascadeOnDelete();

            // Unique transaction id sent to SSLCommerz as tran_id.
            $table->string('tran_id', 64)->unique();
            $table->decimal('amount', 12, 2);
            $table->string('currency', 10)->default('BDT');

            // pending | paid | failed | cancelled
            $table->string('status', 20)->default('pending');

            $table->string('session_key')->nullable();
            $table->string('val_id')->nullable();
            $table->string('bank_tran_id')->nullable();
            $table->string('card_type')->nullable();
            $table->string('failure_reason')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->index(['vendor_profile_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendor_registration_payments');
    }
};
