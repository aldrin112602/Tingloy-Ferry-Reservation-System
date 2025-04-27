<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Passenger;
use App\Models\Route;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{

    
    /**
     * Process the booking form
     */
    public function store(Request $request)
    {
        $request->validate([
            'route_id' => 'required|exists:routes,id',
            'full_name' => 'required|string|max:255',
            'age' => 'required|integer|min:0',
            'contact_number' => 'required|string|max:20',
            'residency_status' => 'required|in:resident,non-resident',
            'address' => 'required|string',
            'additional_passengers' => 'nullable|array',
            'additional_passengers.*.full_name' => 'required|string|max:255',
            'additional_passengers.*.age' => 'required|integer|min:0',
        ]);
        
        // Get the selected route
        $route = Route::findOrFail($request->route_id);
        
        // Count total passengers
        $additionalPassengersCount = is_array($request->additional_passengers) ? count($request->additional_passengers) : 0;
        $totalPassengers = 1 + $additionalPassengersCount;
        
        // Check if selected route has enough capacity
        if ($route->availableSeats() < $totalPassengers) {
            return back()->withErrors(['route_id' => 'Not enough seats available on this route.'])->withInput();
        }
        
        DB::beginTransaction();
        try {
            // Create booking
            $booking = Booking::create([
                'user_id' => Auth::id() ?? 1,
                'origin' => $route->start_location,
                'destination' => $route->end_location,
                'travel_date' => $route->date_and_time->toDateString(),
                'departure_time' => $route->date_and_time->toTimeString(),
                'number_of_passengers' => $totalPassengers,
                'status' => 'pending',
            ]);
            
            // Create main passenger
            Passenger::create([
                'booking_id' => $booking->id,
                'full_name' => $request->full_name,
                'age' => $request->age,
                'contact_number' => $request->contact_number,
                'address' => $request->address,
                'residency_status' => $request->residency_status,
                'is_main_passenger' => true,
            ]);
            
            // Create additional passengers
            if (!empty($request->additional_passengers)) {
                foreach ($request->additional_passengers as $passengerData) {
                    Passenger::create([
                        'booking_id' => $booking->id,
                        'full_name' => $passengerData['full_name'],
                        'age' => $passengerData['age'],
                        'residency_status' => $request->residency_status,
                        'is_main_passenger' => false,
                    ]);
                }
            }
            
            // Update route seats occupied
            $route->increment('seats_occupied', $totalPassengers);
            
            DB::commit();
            
            // Redirect to payment page
            return redirect()->route('bookings.payment', $booking->id)
                ->with('success', 'Booking created successfully. Please proceed to payment.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'An error occurred while processing your booking: ' . $e->getMessage()])->withInput();
        }
    }
    
    /**
     * Add a passenger to an existing booking
     */
    public function addPassenger(Request $request, Booking $booking)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'age' => 'required|integer|min:0',
        ]);
        
        // Check if the route associated with this booking has enough capacity
        $route = Route::where('start_location', $booking->origin)
            ->where('end_location', $booking->destination)
            ->where('date_and_time', $booking->travel_date . ' ' . $booking->departure_time)
            ->first();
            
        if ($route && $route->availableSeats() < 1) {
            return back()->withErrors(['error' => 'No more seats available on this route.']);
        }
        
        DB::beginTransaction();
        try {
            // Create new passenger
            Passenger::create([
                'booking_id' => $booking->id,
                'full_name' => $request->full_name,
                'age' => $request->age,
                'residency_status' => $request->residency_status ?? 'non-resident',
                'is_main_passenger' => false,
            ]);
            
            // Update booking passenger count
            $booking->increment('number_of_passengers');
            
            // Update route seats occupied if applicable
            if ($route) {
                $route->increment('seats_occupied');
            }
            
            DB::commit();
            
            return back()->with('success', 'Passenger added successfully.');
            
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'An error occurred while adding passenger: ' . $e->getMessage()]);
        }
    }
}