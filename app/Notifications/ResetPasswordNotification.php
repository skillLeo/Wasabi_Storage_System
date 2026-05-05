<?php

namespace App\Notifications;

use App\Models\BrandingSetting;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public function __construct(private string $token) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $b = BrandingSetting::shared();

        $url = url(route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));

        return (new MailMessage)
            ->subject($b['email_reset_subject'])
            ->greeting($b['email_reset_greeting'])
            ->line($b['email_reset_intro'])
            ->action($b['email_reset_button'], $url)
            ->line($b['email_reset_expire'])
            ->line($b['email_reset_no_action']);
    }
}
