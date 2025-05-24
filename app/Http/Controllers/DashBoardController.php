<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Booking;
use Illuminate\Support\Facades\Auth;
use App\Models\Route as Schedule;
use Carbon\Carbon;

class DashBoardController extends Controller
{
    public function index()
    {
        $bookings = Booking::where('user_id', Auth::id())->get();
        $now = Carbon::now();

        $nextTrip = Schedule::where('date_and_time', '>', $now)
            ->orderBy('date_and_time', 'asc')
            ->first();

        $upcomingTrips = Schedule::where('date_and_time', '>', $now)
            ->orderBy('date_and_time', 'asc')
            ->take(5)
            ->get();

        return Inertia::render('dashboard', [
            'bookings' => $bookings,
            'nextTrip' => $nextTrip,
            'upcomingTrips' => $upcomingTrips,
        ]);
    }
}
