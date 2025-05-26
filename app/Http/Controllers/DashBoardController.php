<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Booking;
use App\Models\Passenger;
use Illuminate\Support\Facades\Auth;
use App\Models\Route as Schedule;
use Carbon\Carbon;

class DashBoardController extends Controller
{
    public function index()
    {
        $bookings = Booking::where('user_id', Auth::id())->get();
        $allBookings = Booking::all();
        $now = Carbon::now();

        $nextTrip = Schedule::where('date_and_time', '>', $now)
            ->orderBy('date_and_time', 'asc')
            ->first();

        $upcomingTrips = Schedule::where('date_and_time', '>', $now)
            ->orderBy('date_and_time', 'asc')
            ->take(5)
            ->get();

        $passengers = Passenger::all();

        $boardedCount = Passenger::count();

        $todaysTripCount = Schedule::whereDate('updated_at', Carbon::today())->count();

        $qrScannedCountToday = Booking::whereDate('updated_at', Carbon::today())->where('status', 'boarded')->count();

        return Inertia::render('dashboard', [
            'bookings' => $bookings,
            'nextTrip' => $nextTrip,
            'upcomingTrips' => $upcomingTrips,
            'passengers' => $passengers,
            'allBookings' => $allBookings,
            'boardedCount' => $boardedCount,
            'todaysTripCount' => $todaysTripCount,
            'qrScannedCountToday' => $qrScannedCountToday
        ]);
    }
}
