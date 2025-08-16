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
        'payment_method',
        'receipt_image',
        'total_fee',
        'is_paid',
        'number_of_passengers',
        'status',
        'children_counts',
        'childrens_contact_person',
        'childrens_contact_number',
        'qr_code'
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

    // Generate incremental ticket code automatically
    protected static function booted()
    {
        static::creating(function ($booking) {
            $lastBooking = static::latest('id')->first();
            $lastNumber = 0;

            if ($lastBooking && preg_match('/TF-(\d+)/', $lastBooking->ticket_code, $matches)) {
                $lastNumber = (int) $matches[1];
            }
            $nextNumber = $lastNumber + 1;
            $booking->ticket_code = 'TF-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
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
