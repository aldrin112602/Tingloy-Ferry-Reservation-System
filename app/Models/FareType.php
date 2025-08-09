<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FareType extends Model
{
    protected $table = 'fare_types';
    protected $fillable = [
        'name',
        'price'
    ];
}
