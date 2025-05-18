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


    public function approve($id)
    {
        $booking = Booking::findOrFail($id);
        if ($booking->status == 'approved') {
            return redirect()->back()->with('error', 'Booking already approved');
        }

        if ($booking->status == 'rejected') {
            return redirect()->back()->with('error', 'Booking already rejected');
        }
    
        $booking->status = 'approved';
        $booking->save();
        return redirect()->back()->with('success', 'Booking approved successfully');
    }


    public function reject($id)
    {
        $booking = Booking::findOrFail($id);
        if ($booking->status == 'rejected') {
            return redirect()->back()->with('error', 'Booking already rejected');
        }

        if ($booking->status == 'approved') {
            return redirect()->back()->with('error', 'Booking already approved');
        }
    
        $booking->status = 'rejected';
        $booking->save();
        return redirect()->back()->with('success', 'Booking rejected successfully');
    }
}
