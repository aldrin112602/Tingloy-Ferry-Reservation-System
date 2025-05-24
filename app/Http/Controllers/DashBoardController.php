<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Booking;
use Illuminate\Support\Facades\Auth;

class DashBoardController extends Controller
{
    public function index()
    {
        $bookings = Booking::where('user_id', Auth::id())->get();
        
        return Inertia::render('dashboard', ['bookings' => $bookings]);
    }
}
