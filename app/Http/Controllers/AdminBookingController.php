<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Booking;

class AdminBookingController extends Controller
{
    public function index()
    {
        // show all bookings under User
        $users = User::where('role', 'passenger')->with('booking')->get();

        return Inertia::render('features/admin/ManageBookings', ['users' => $users]);
    }


    public function show($id)
    {
        $booking = Booking::with('passengers')->with('route')->findOrFail($id);
        return Inertia::render('features/admin/BookingDetails', ['booking' => $booking]);
    }
}
