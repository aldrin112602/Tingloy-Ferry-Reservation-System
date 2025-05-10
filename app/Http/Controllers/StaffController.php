<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Route;

class StaffController extends Controller
{
    public function passengerList()
    {
        $paginatedResponseData = Route::latest()->paginate(10);
        return Inertia::render('features/staff/PassengerList', 
        ['paginatedResponseData' => $paginatedResponseData]);
    }



    public function scanQrCode()
    {
        return Inertia::render('features/staff/ScanQrCode');
    }
}
