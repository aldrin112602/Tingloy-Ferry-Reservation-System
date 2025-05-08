<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Storage;

class BookingNotification extends Notification
{
    use Queueable;

    public $base64Qr;

    public function __construct($base64Qr)
    {
        $this->base64Qr = $base64Qr;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        // Get the full server path for the SVG file
        // $fullPath = Storage::disk('public')->path($this->base64Qr);
        
        // // Get the SVG content
        // $svgContent = Storage::disk('public')->get($this->base64Qr);
        
        return (new MailMessage)
            ->subject('Tingloy Ferry Ticket Confirmation')
            ->markdown('booking-notification', [
                'name' => $notifiable->name,
                'base64Qr' => $this->base64Qr,
            ])
            ->attachData($this->base64Qr, 'ticket-qrcode.png', [
                'mime' => 'image/png'
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}