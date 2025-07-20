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
        Schema::create('passengers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->string('full_name');
            $table->integer('children_counts')->nullable()->default(0);
            $table->integer('age');
            $table->string('contact_number')->nullable();
            $table->text('address')->nullable(); 
            $table->integer('passenger_fare')->default(160);
            $table->string('passenger_fare_type')->default('full fare');
            $table->text('file')->nullable();
            $table->enum('residency_status', ['resident', 'non-resident'])->default('non-resident');
            $table->boolean('is_main_passenger')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('passengers');
    }
};
