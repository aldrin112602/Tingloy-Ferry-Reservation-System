<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;


class AdminBookingController extends Controller
{
    public function index()
    {
        // show all bookings under User
        $users = User::where('role', 'passenger')->with('booking')->get();

        return Inertia::render('features/admin/ManageBookings', ['users' => $users]);
    }
}
