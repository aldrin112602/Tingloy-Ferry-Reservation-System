<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Route extends Model
{
    protected $fillables = [
        'name',
        'start_location',
        'route_code',
        'end_location',
        'capacity',
        'seats_occupied',
        'date_and_time',
        'status'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->route_code = uniqid();
        });
    }
}
