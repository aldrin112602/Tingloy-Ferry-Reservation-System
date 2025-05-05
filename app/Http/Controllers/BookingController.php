<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Passenger;
use App\Models\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Notifications\BookingNotification;
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
        ];

        $validator = $request->validate([
            'route_id' => 'required|exists:routes,id',
            'full_name' => 'required',
            'age' => 'required|integer|min:0',
            'contact_number' => 'required|string|max:20',
            'residency_status' => 'required',
            'address' => 'required',
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
                'origin' => $route->start_location,
                'destination' => $route->end_location,
                'travel_date' => $route->date_and_time->toDateString(),
                'departure_time' => $route->date_and_time->toTimeString(),
                'number_of_passengers' => $totalPassengers,
                'payment_method' => $request->payment_method,
                'receipt_image' => $receiptPath,
                'status' => 'pending',
            ]);


            $ticketCode = $booking->ticket_code;
            $qrcode = QrCode::format('svg')->size(300)->generate($ticketCode);
            Storage::disk('public')->put('qrcodes/' . $ticketCode . '.svg', $qrcode);
            $qrcodePath = 'qrcodes/' . $ticketCode . '.svg';
            Auth::user()->notify(new BookingNotification($qrcodePath));

            Passenger::create([
                'booking_id' => $booking->id,
                'full_name' => $request->full_name,
                'age' => $request->age,
                'contact_number' => $request->contact_number,
                'address' => $request->address,
                'residency_status' => $request->residency_status,
                'is_main_passenger' => true,
            ]);

            if (!empty($request->additional_passengers)) {
                foreach ($request->additional_passengers as $passenger) {
                    Passenger::create([
                        'booking_id' => $booking->id,
                        'full_name' => $passenger['full_name'],
                        'age' => $passenger['age'],
                        'contact_number' => $passenger['contact_number'],
                        'address' => $passenger['address'],
                        'residency_status' => $passenger['residency_status'],
                        'is_main_passenger' => false,
                    ]);
                }
            }

            $route->increment('seats_occupied', $totalPassengers);

            DB::commit();

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
}
