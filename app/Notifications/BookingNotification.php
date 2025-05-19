<?php

namespace App\Notifications;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;


class BookingNotification extends Notification
{
    use Queueable;

    public $qrURL, $booking;

    public function __construct($qrURL, $booking)
    {
        $this->qrURL = $qrURL;
        $this->booking = $booking;
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
        return (new MailMessage)
            ->subject('Tingloy Ferry Ticket Confirmation')
            ->markdown('booking-notification', [
                'name' => $notifiable->name,
                'qrURL' => $this->qrURL,
                'booking' => $this->booking,
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