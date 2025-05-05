<x-mail::message>
# Hello {{ $name }},

Thank you for booking with **Tingloy Ferry Reservation**!

Please **keep the QR code below** – it will serve as your **ticket** for boarding.  
Present this code at the terminal for quick and secure verification.

<img src="{{ $qrcodePath }}" style="max-width: 200px; margin: 20px 0;" alt="QR Code">

<x-mail::button :url="'http://127.0.0.1:8000'">
Visit Our Website
</x-mail::button>

Safe travels,  
**Tingloy Ferry Team**
</x-mail::message>
