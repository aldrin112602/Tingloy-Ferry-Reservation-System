<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Route;

class StaffController extends Controller
{
    public function passengerList()
    {
        $paginatedResponseData = Route::with('bookings')->with('passengers')->latest()->paginate(9);
        return Inertia::render(
            'features/staff/PassengerList',
            ['paginatedResponseData' => $paginatedResponseData]
        );
    }



    public function scanQrCode()
    {
        return Inertia::render('features/staff/ScanQrCode');
    }
}
