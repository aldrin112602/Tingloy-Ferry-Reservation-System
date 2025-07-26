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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('route_id')->constrained()->onDelete('cascade');
            $table->string('ticket_code')->unique();
            $table->string('payment_method')->default('cash');
            $table->string('receipt_image')->nullable();
            $table->integer('total_fee')->default(160);
            $table->boolean('is_paid')->default(false);
            $table->integer('number_of_passengers')->default(1);
            $table->integer('children_counts')->nullable()->default(0);
            $table->string('childrens_contact_person')->nullable()->default('N/A');
            $table->string('childrens_contact_number')->nullable()->default('N/A');
            $table->string('status')->default('pending');
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
