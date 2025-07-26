<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SetupPayment extends Model
{
    protected $fillable = [
        'payment_method_name',
        'account_name',
        'account_number',
    ];

    protected $table = 'setup_payments';
}
