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
            $table->enum('status', ['active', 'inactive'])->default('active')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('routes');
    }
};
