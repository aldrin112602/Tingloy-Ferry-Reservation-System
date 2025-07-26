<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('setup_payments', function (Blueprint $table) {
            $table->id();
            $table->string('payment_method_name'); // e.g., Gcash, BDO, Bank Transfer
            $table->string('account_name');        // e.g., Aldrin Caballero
            $table->string('account_number');      // e.g., 09512793354, 1234567890
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('setup_payments');
    }
};
