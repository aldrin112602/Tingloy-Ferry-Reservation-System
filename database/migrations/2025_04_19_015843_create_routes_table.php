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
        Schema::create('routes', function (Blueprint $table) {
            $table->id();
            $table->string('name')->default('Tingloy Ferry')->nullable();
            $table->string('route_code')->unique()->nullable();
            $table->enum('start_location', ['Tingloy', 'Mabini'])->nullable();
            $table->enum('end_location', ['Tingloy', 'Mabini'])->nullable();
            $table->integer('capacity')->default(240)->nullable();
            $table->dateTime('date_and_time')->nullable();
            $table->integer('seats_occupied')->default(0)->nullable();
            $table->enum('status', ['scheduled', 'departed', 'in_transit', 'arrived', 'cancelled'])->default('scheduled');
            $table->timestamps();
        });

        /**
         * 
         * 
            'scheduled'
            Meaning: The trip has been created and is planned, but it hasn’t left yet.

            Use case: Still accepting bookings, displayed in the timetable, not yet full or departed.

            'departed'
            Meaning: The ferry/trip has already left the starting point.

            Use case: Bookings are closed; users can’t join this trip anymore.

            'in_transit'
            Meaning: The trip is currently ongoing — between start and end points.

            Use case: The ferry is on the way to its destination. Useful if you want to show real-time updates.

            'arrived'
            Meaning: The ferry has reached its destination.

            Use case: The trip is fully completed. It may be archived or marked as history.

            'cancelled'
            Meaning: The trip was called off and will not proceed.

            Use case: Inform passengers and block bookings. Can also be used to trigger refunds or rebooking flows.

         */
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('routes');
    }
};
