<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Models\Booking;
use App\Models\Passenger;

class Route extends Model
{
    protected $fillable = [
        'name',
        'route_code',
        'start_location',
        'end_location',
        'capacity',
        'date_and_time',
        'seats_occupied',
        'status',
    ];

    protected $casts = [
        'date_and_time' => 'datetime:Y-m-d H:i:s',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function passengers()
    {
        return $this->hasManyThrough(
            Passenger::class,
            Booking::class,
            'route_id',
            'booking_id',
            'id',
            'id'
        );
    }


    public function availableSeats()
    {
        return $this->capacity - $this->seats_occupied;
    }

    public function isAvailable()
    {
        return $this->status === 'active' && $this->availableSeats() > 0;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->route_code = 'CODE-' . Str::uuid();
        });
    }
}
