<x-mail::message>
# Tingloy Ferry Booking Confirmation

Thank you for booking with Tingloy Ferry Reservation System.

Below is your QR code ticket. Please keep it safe — it is required for boarding.

<img src="{{ $base64Qr }}" alt="QR Code" width="200">

If you have any questions, feel free to contact us.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
