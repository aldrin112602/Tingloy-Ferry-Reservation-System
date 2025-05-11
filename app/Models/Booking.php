<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Route;
use App\Models\Passenger;

class Booking extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */

    protected $fillable = [
        'user_id',
        'route_id',
        'ticket_code',
        'number_of_passengers',
        'status'
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function route()
    {
        return $this->belongsTo(Route::class);
    }

    public function passengers()
    {
        return $this->hasMany(Passenger::class);
    }

    public function mainPassenger()
    {
        return $this->passengers()->where('is_main_passenger', true)->first();
    }

    // Generate ticket code automatically
    protected static function booted()
    {
        static::creating(function ($booking) {
            $booking->ticket_code = 'FT-' . strtoupper(uniqid());
        });
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'created_at',
        'updated_at',
    ];
}
