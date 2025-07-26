<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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
        'id_file',
    ];

    protected $casts = [
        'is_main_passenger' => 'boolean',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function getValidIdUrlAttribute()
    {
        if ($this->valid_id_path) {
            return Storage::url($this->valid_id_path);
        }
        return null;
    }
}
