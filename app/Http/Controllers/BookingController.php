<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Notification;
use App\Models\Passenger;
use App\Models\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;


class BookingController extends Controller
{
    /**
     * Process the booking form
     */
    public function store(Request $request)
    {

        $messages = [
            'additional_passengers.*.full_name.required' => 'All passenger names are required.',
            'additional_passengers.*.age.required' => 'Age is required for all passengers.',
            'additional_passengers.*.age.integer' => 'Age must be a number for all passengers.',
            'additional_passengers.*.age.min' => 'Age cannot be negative for any passenger.',
            'additional_passengers.*.contact_number.required' => 'Contact number is required for all passengers.',
            'additional_passengers.*.residency_status.required' => 'Residency status is required for all passengers.',
            'additional_passengers.*.address.required' => 'Address is required for all passengers.',
            'additional_passengers.*.passenger_fare_type.required' => 'Passenger fare type is required for all passengers.',
        ];


        $fare_types = [
            'Full fare' => 160,
            'Senior/PWD with valid ID' => 104,
            'Student with valid ID' => 116,
            'Children 3ys-12yrs old' => 72
        ];

        $total_fee = 0;

        $request->validate([
            'route_id' => 'required|exists:routes,id',
            'full_name' => 'required',
            'age' => 'required|integer|min:0',
            'contact_number' => 'required|string|max:20',
            'residency_status' => 'required',
            'address' => 'required',
            'passenger_fare_type' => 'required',
            'payment_method' => 'required|string',
            'receipt_image' => 'nullable|file|image',

            'additional_passengers' => 'sometimes|array',
            'additional_passengers.*.full_name' => 'required_with:additional_passengers',
            'additional_passengers.*.age' => 'required_with:additional_passengers|integer|min:0',
            'additional_passengers.*.contact_number' => 'required_with:additional_passengers|string|max:20',
            'additional_passengers.*.residency_status' => 'required_with:additional_passengers',
            'additional_passengers.*.address' => 'required_with:additional_passengers',
        ], $messages);

        $route = Route::findOrFail($request->route_id);
        $additionalCount = is_array($request->additional_passengers) ? count($request->additional_passengers) : 0;
        $totalPassengers = 1 + $additionalCount;

        if ($route->availableSeats() < $totalPassengers) {
            return response()->json([
                'message' => 'Not enough seats available on this route.',
            ], 422);
        }

        DB::beginTransaction();

        try {
            $receiptPath = null;
            if ($request->hasFile('receipt_image')) {
                $receiptPath = $request->file('receipt_image')->store('receipts', 'public');
            }

            $booking = Booking::create([
                'user_id' => Auth::id() ?? 1,
                'route_id' => (int) $request->route_id,
                'number_of_passengers' => $totalPassengers,
                'payment_method' => $request->payment_method,
                'receipt_image' => $receiptPath,
                'status' => 'pending',
            ]);

            $total_fee = $total_fee + $fare_types[$request->passenger_fare_type];

            Passenger::create([
                'booking_id' => $booking->id,
                'full_name' => $request->full_name,
                'age' => $request->age,
                'contact_number' => $request->contact_number,
                'address' => $request->address,
                'children_counts' => $request->children_counts ?? 0,
                'passenger_fare_type' => $request->passenger_fare_type,
                'passenger_fare' => $fare_types[$request->passenger_fare_type],
                'residency_status' => $request->residency_status,
                'is_main_passenger' => true,
            ]);

            if (!empty($request->additional_passengers)) {
                foreach ($request->additional_passengers as $passenger) {
                    $total_fee = $total_fee + $fare_types[$passenger['passenger_fare_type']];

                    Passenger::create([
                        'booking_id' => $booking->id,
                        'full_name' => $passenger['full_name'],
                        'age' => $passenger['age'],
                        'contact_number' => $passenger['contact_number'],
                        'address' => $passenger['address'],
                        'passenger_fare_type' => $passenger['passenger_fare_type'],
                        'passenger_fare' => $fare_types[$passenger['passenger_fare_type']],
                        'residency_status' => $passenger['residency_status'],
                        'is_main_passenger' => false,
                    ]);
                }
            }

            $route->increment('seats_occupied', $totalPassengers);
            $booking->update([
                'total_fee' => $total_fee
            ]);
            $booking->save();

            DB::commit();

            Notification::create([
                'sender_id' => Auth::id(),
                'booking_id' => $booking->id,
                'type' => 'booking',
                'message' => 'Booking successful',
            ]);

            return response()->json([
                'message' => 'Booking successful. Proceed to payment.',
                'booking' => $booking,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Booking failed.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function index()
    {
        $bookings = Booking::where('user_id', Auth::id())->with('passengers')->with('route')->get();
        return Inertia::render('features/passenger/MyBookings', ['bookings' => $bookings]);
    }

    public function cancel(Request $request, Booking $booking)
    {
        if (Auth::id() !== $booking->user_id) {
            return response()->json([
                'message' => 'You are not authorized to cancel this booking.',
            ], 403);
        }

        if ($booking->status === 'confirmed' || $booking->status === 'completed') {
            return response()->json([
                'message' => 'This booking cannot be canceled as it is already ' . $booking->status . '.',
            ], 400);
        }

        $request->validate([
            'cancellation_reason' => 'nullable|string|max:1000',
        ]);

        DB::beginTransaction();

        try {
            $route = Route::find($booking->route_id);
            $booking->status = 'canceled';
            $booking->cancellation_reason = $request->cancellation_reason;
            $booking->save();

            // Create a notification for the cancellation
            Notification::create([
                'sender_id' => Auth::id(),
                'booking_id' => $booking->id,
                'type' => 'cancellation',
                'message' => $request->cancellation_reason,
            ]);

            if ($route) {
                $route->decrement('seats_occupied', $booking->number_of_passengers);
            }

            DB::commit();

            return response()->json([
                'message' => 'Booking successfully canceled.',
                'booking' => $booking,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to cancel booking.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
