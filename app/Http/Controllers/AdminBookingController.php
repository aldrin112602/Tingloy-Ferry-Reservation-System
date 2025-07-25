<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Booking;
use App\Models\Notification;
use App\Notifications\BookingNotification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Auth;


class AdminBookingController extends Controller
{
    public function index()
    {
        $users = User::where('role', 'passenger')
            ->with('booking')
            ->get()
            ->sortBy('created_at')
            ->values();


        $mappedUsers = $users->map(function ($user) {
            $userArray = $user->toArray();
            $userArray['booking'] = $user->booking->sortBy('created_at')->values()->toArray();
            return $userArray;
        });

        return Inertia::render('features/admin/ManageBookings', ['users' => $mappedUsers]);
    }


    public function show($id)
    {
        $booking = Booking::with('passengers')->with('route')->findOrFail($id);
        return Inertia::render('features/admin/BookingDetails', ['booking' => $booking]);
    }


    public function approve($id)
    {
        $booking = Booking::with('user')->findOrFail($id);
        if ($booking->status == 'approved') {
            return redirect()->back()->with('error', 'Booking already approved');
        }

        if ($booking->status == 'rejected') {
            return redirect()->back()->with('error', 'Booking already rejected');
        }


        $data = "Booking ID: {$booking->id}\n"
            . "Route Code: {$booking->route->route_code}\n"
            . "Ticket Code: {$booking->ticket_code}";

        $encrypted = Crypt::encryptString($data);

        $qrURL = "https://quickchart.io/qr?text=" . urlencode($encrypted) . "&size=500&download=true";

        Notification::create(
            [
                'sender_id' => Auth::id(),
                'receiver_id' => $booking->user->id,
                'booking_id' => $booking->id,
                'type' => 'Booking Status',
                'message' => 'Congratulations your booking has been approved successfully',
            ]
        );


        $booking->user->notify(new BookingNotification($qrURL, $booking));

        $booking->status = 'approved';
        $booking->save();
        return redirect()->back()->with('success', 'Booking approved successfully');
    }


    public function reject($id)
    {
        $booking = Booking::with('user')->findOrFail($id);
        if ($booking->status == 'rejected') {
            return redirect()->back()->with('error', 'Booking already rejected');
        }

        if ($booking->status == 'approved') {
            return redirect()->back()->with('error', 'Booking already approved');
        }

        $booking->status = 'rejected';
        $booking->save();


        Notification::create(
            [
                'sender_id' => Auth::id(),
                'receiver_id' => $booking->user->id,
                'booking_id' => $booking->id,
                'type' => 'Booking Status',
                'message' => 'Sorry your booking has been rejected.',
            ]
        );


        return redirect()->back()->with('success', 'Booking rejected successfully');
    }
}
