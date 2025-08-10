<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use App\Models\Booking;
use App\Models\Route;
use App\Models\User;

class QrController extends Controller
{
    public function validate(Request $request)
    {
        $request->validate([
            'data' => 'required|string'
        ]);

        try {
            $decrypted = Crypt::decryptString($request->data);
            $data = explode("\n", $decrypted);

            $bookingId = explode(": ", $data[0])[1];
            $routeCode = explode(": ", $data[1])[1];
            $ticketCode = explode(": ", $data[2])[1];


            $booking = Booking::with('route', 'user')->where('id', $bookingId)->first();
            $route = Route::where('route_code', $routeCode)->first();

            if (!isset($booking) || !isset($route)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid QR code. Booking, route, or user not found.',
                ], 422);
            }

            if ($booking->status === 'pending' && $booking->payment_method !== 'Cash') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Booking is not approved yet. Please contact the admin.',
                ], 422);
            }

            if ($booking->status == 'boarded') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Booking already boarded.',
                ], 422);
            }
            if ($booking->ticket_code != $ticketCode) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid ticket code. Please contact admin.',
                ], 422);
            }

            if ($route->id != $booking->route_id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Route not authorized for this booking.',
                    'booking_id' => $booking->id,
                ], 422);
            }

            if ($booking->payment_method == 'Cash' && !$booking->is_paid) {
                return response()->json([
                    'status' => 'error',
                    'message' => "This booking was made with cash payment and hasn't been paid yet. Please complete the payment before boarding.",
                    'can_mark_as_paid' => true,
                    'booking_id' => $booking->id,
                ], 422);
            }


            $booking->status = 'boarded';
            $booking->save();

            return response()->json([
                'status' => 'success',
                'message' => "Congratulations {$booking->user->name}!,QR code validated successfully."
            ]);

        } catch (DecryptException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid QR code. Unable to decrypt data.',
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred.',
            ], 500);
        }
    }

    public function bookingPaid($id)
    {

        $booking = Booking::where('id', $id)->first();
        if(!isset($booking)) {
            return response()->json(['message' => 'Booking not found.'], 500);
        }

        $booking->is_paid = true;
        $booking->status = 'boarded';
        $booking->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Payment status updated successfully.',
            'is_paid' => $booking->is_paid,
        ]);
    }
}
