<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Passenger extends Model
{
    protected $fillable = [
        'booking_id',
        'full_name',
        'age',
        'contact_number',
        'address',
        'file',
        'passenger_fare',
        'passenger_fare_type',
        'residency_status',
        'is_main_passenger',
    ];

    protected $casts = [
        'is_main_passenger' => 'boolean',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
