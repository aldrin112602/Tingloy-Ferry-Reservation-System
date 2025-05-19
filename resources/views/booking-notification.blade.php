<x-mail::message>
# Tingloy Ferry Booking Confirmation

Thank you for booking with Tingloy Ferry Reservation System.

---

{{-- Route Information --}}
**Route Code:** {{ $booking->route->route_code }}  
{{-- Displays route code --}}

**From:** {{ $booking->route->start_location }}  
{{-- Displays start location --}}

**To:** {{ $booking->route->end_location }}  
{{-- Displays end location --}}

**Departure Date & Time:** 
{{ \Carbon\Carbon::parse($booking->route->date_and_time)->format('l, F j, Y \a\t g:i A') }}  
{{-- Displays formatted date like: Friday, May 23, 2025 at 4:30 PM --}}


---

{{-- Booking Details --}}
**Ticket Code:** {{ $booking->ticket_code }}  
{{-- Displays generated ticket code --}}

**Number of Passengers:** {{ $booking->number_of_passengers }}  
{{-- Displays number of booked passengers --}}

**Booked By:** {{ $booking->user->name }}  
{{-- Displays the name of the user who made the booking --}}

---

Below is your QR code ticket. Please keep it safe — it is required for boarding.

<img src="{{ $qrURL }}" alt="QR Code" width="auto" style="max-width: 100%; height: auto;" />

If you have any questions, feel free to contact us.

Thanks,  
{{ config('app.name') }}
</x-mail::message>
