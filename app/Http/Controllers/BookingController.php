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
use Illuminate\Http\UploadedFile;
use App\Models\FareType;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $fareTypes = FareType::all()->keyBy('id');
        $fareTypeIds = $fareTypes->keys()->toArray();

        $fareIdsRequiringId = $fareTypes->where('required_valid_id', true)->keys()->toArray();
        $messages = [
            'additional_passengers.*.full_name.required_with' => 'All passenger names are required.',
            'additional_passengers.*.age.required_with' => 'Age is required for all passengers.',
            'additional_passengers.*.age.integer' => 'Age must be a number for all passengers.',
            'additional_passengers.*.age.min' => 'Age cannot be negative for any passenger.',
            'additional_passengers.*.contact_number.required_with' => 'Contact number is required for all passengers.',
            'additional_passengers.*.residency_status.required_with' => 'Residency status is required for all passengers.',
            'additional_passengers.*.address.required_with' => 'Address is required for all passengers.',
            'additional_passengers.*.passenger_fare_type.required_with' => 'Passenger fare type is required for all passengers.',
            'additional_passengers.*.id_file.required_if' => 'A valid ID is required for this fare type.',
        ];

        $request->validate([
            'route_id' => ['required', 'exists:routes,id'],
            'full_name' => ['required', 'string', 'max:255'],
            'age' => ['required', 'integer', 'min:0'],
            'contact_number' => ['required', 'string', 'max:20'],
            'residency_status' => ['required', 'string'],
            'address' => ['required', 'string'],
            'passenger_fare_type' => ['required', 'in:' . implode(',', $fareTypeIds)],
            'id_file' => ['required_if:passenger_fare_type,' . implode(',', $fareIdsRequiringId), 'nullable', 'file', 'image', 'mimes:jpeg,png,jpg,gif,svg,pdf', 'max:2048'],
            'payment_method' => ['required', 'string'],
            'receipt_image' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg,gif,svg,pdf', 'max:2048'],

            'additional_passengers' => ['sometimes', 'array'],
            'additional_passengers.*.full_name' => ['required_with:additional_passengers', 'string', 'max:255'],
            'additional_passengers.*.age' => ['required_with:additional_passengers', 'integer', 'min:0'],
            'additional_passengers.*.contact_number' => ['required_with:additional_passengers', 'string', 'max:20'],
            'additional_passengers.*.residency_status' => ['required_with:additional_passengers', 'string'],
            'additional_passengers.*.address' => ['required_with:additional_passengers', 'string'],
            'additional_passengers.*.passenger_fare_type' => ['required_with:additional_passengers', 'in:' . implode(',', $fareTypeIds)],
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
            $mainPassengerFareType = $fareTypes->get($request->passenger_fare_type);
            $mainPassengerIdPath = null;
            if ($mainPassengerFareType && $mainPassengerFareType->required_valid_id && $request->hasFile('id_file')) {
                $mainPassengerIdPath = $request->file('id_file')->store('ids', 'public');
            }

            $booking = Booking::create([
                'user_id' => Auth::id() ?? 1,
                'route_id' => (int) $request->route_id,
                'number_of_passengers' => $totalPassengers,
                'children_counts' => $request->children_counts ?? 0,
                'childrens_contact_person' => $request->childrens_contact_person ?? null,
                'childrens_contact_number' => $request->childrens_contact_number ?? null,
                'payment_method' => ucwords($request->payment_method),
                'receipt_image' => $receiptPath,
                'status' => 'pending',
            ]);

            $total_fee = $mainPassengerFareType->price;

            // Create main passenger
            Passenger::create([
                'booking_id' => $booking->id,
                'full_name' => $request->full_name,
                'age' => $request->age,
                'contact_number' => $request->contact_number,
                'address' => $request->address,
                'passenger_fare_type' => $mainPassengerFareType->name,
                'passenger_fare' => $mainPassengerFareType->price,
                'residency_status' => $request->residency_status,
                'is_main_passenger' => true,
                'id_file' => $mainPassengerIdPath,
            ]);

            // Create additional passengers
            if (!empty($request->additional_passengers)) {
                foreach ($request->additional_passengers as $passengerData) {
                    $additionalPassengerFareType = $fareTypes->get($passengerData['passenger_fare_type']);

                    if ($additionalPassengerFareType) {
                        $total_fee += $additionalPassengerFareType->price;

                        $additionalIdPath = null;
                        if ($additionalPassengerFareType->required_valid_id && isset($passengerData['id_file']) && $passengerData['id_file'] instanceof UploadedFile) {
                            $additionalIdPath = $passengerData['id_file']->store('ids', 'public');
                        }

                        Passenger::create([
                            'booking_id' => $booking->id,
                            'full_name' => $passengerData['full_name'],
                            'age' => $passengerData['age'],
                            'contact_number' => $passengerData['contact_number'],
                            'address' => $passengerData['address'],
                            'passenger_fare_type' => $additionalPassengerFareType->name,
                            'passenger_fare' => $additionalPassengerFareType->price,
                            'residency_status' => $passengerData['residency_status'],
                            'is_main_passenger' => false,
                            'id_file' => $additionalIdPath,
                        ]);
                    }
                }
            }

            $route->increment('seats_occupied', $totalPassengers);
            $booking->update(['total_fee' => $total_fee]);

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
