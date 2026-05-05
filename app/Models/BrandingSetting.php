<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class BrandingSetting extends Model
{
    protected $fillable = [
        'logo_path',
        'brand_color',
        'logo_width_desktop',
        'logo_width_mobile',
        'logo_width_sidebar',
        'logo_alt_text',
        'login_headline',
        'login_subheading',
        'login_feature_one',
        'login_feature_two',
        'login_feature_three',
        'login_form_title',
        'login_form_subtitle',
        'login_email_label',
        'login_email_placeholder',
        'login_password_label',
        'login_password_placeholder',
        'login_submit_text',
        'login_submitting_text',
        'login_help_text',
        'login_forgot_password_text',
        'forgot_title',
        'forgot_panel_headline',
        'forgot_panel_subheading',
        'forgot_subtitle',
        'forgot_email_label',
        'forgot_email_placeholder',
        'forgot_submit_text',
        'forgot_submitting_text',
        'forgot_back_text',
        'reset_badge_text',
        'reset_title',
        'reset_description',
        'reset_email_label',
        'reset_new_password_label',
        'reset_new_password_placeholder',
        'reset_confirm_label',
        'reset_confirm_placeholder',
        'reset_submit_text',
        'reset_submitting_text',
        'reset_back_text',
        'email_reset_subject',
        'email_reset_greeting',
        'email_reset_intro',
        'email_reset_button',
        'email_reset_expire',
        'email_reset_no_action',
    ];

    protected $casts = [
        'logo_width_desktop' => 'integer',
        'logo_width_mobile' => 'integer',
        'logo_width_sidebar' => 'integer',
    ];

    public static function defaults(): array
    {
        return [
            'logo_path' => 'logo.png',
            'brand_color' => '#2d6ea0',
            'logo_width_desktop' => 260,
            'logo_width_mobile' => 220,
            'logo_width_sidebar' => 185,
            'logo_alt_text' => 'No One Left Behind',
            'login_headline' => 'Employee Document Portal',
            'login_subheading' => 'Upload and manage your required company documents securely - all in one place.',
            'login_feature_one' => 'Secure cloud storage',
            'login_feature_two' => 'Upload in seconds',
            'login_feature_three' => 'Track your progress',
            'login_form_title' => 'Welcome back',
            'login_form_subtitle' => 'Sign in to access your documents',
            'login_email_label' => 'Email address',
            'login_email_placeholder' => 'you@company.com',
            'login_password_label' => 'Password',
            'login_password_placeholder' => 'Password',
            'login_submit_text' => 'Sign in',
            'login_submitting_text' => 'Signing in...',
            'login_help_text' => 'Need access? Contact your administrator.',
            'login_forgot_password_text' => 'Forgot password?',
            'forgot_title' => 'Forgot password?',
            'forgot_panel_headline' => 'Forgot your password?',
            'forgot_panel_subheading' => 'Enter your email and we\'ll send you reset instructions to get you back in.',
            'forgot_subtitle' => 'Enter your email and we will send you a reset link.',
            'forgot_email_label' => 'Email address',
            'forgot_email_placeholder' => 'you@company.com',
            'forgot_submit_text' => 'Send Reset Link',
            'forgot_submitting_text' => 'Sending link...',
            'forgot_back_text' => 'Back to sign in',
            'reset_badge_text' => 'Secure account',
            'reset_title' => 'Reset password',
            'reset_description' => 'Create a new password for this account. The email is locked from the reset link.',
            'reset_email_label' => 'Account email',
            'reset_new_password_label' => 'New password',
            'reset_new_password_placeholder' => 'Min. 8 characters',
            'reset_confirm_label' => 'Confirm password',
            'reset_confirm_placeholder' => 'Repeat new password',
            'reset_submit_text' => 'Reset Password',
            'reset_submitting_text' => 'Resetting...',
            'reset_back_text' => 'Back to sign in',
            'email_reset_subject' => 'Reset Your Password',
            'email_reset_greeting' => 'Hello!',
            'email_reset_intro' => 'You are receiving this email because we received a password reset request for your account.',
            'email_reset_button' => 'Reset Password',
            'email_reset_expire' => 'This password reset link will expire in 60 minutes.',
            'email_reset_no_action' => 'If you did not request a password reset, no further action is required.',
        ];
    }

    public static function current(): self
    {
        return static::query()->first() ?? static::query()->create(static::defaults());
    }

    public static function publicDefaults(): array
    {
        $defaults = static::defaults();

        return array_merge($defaults, [
            'logo_url' => asset($defaults['logo_path']),
            'version' => time(),
        ]);
    }

    public function toPublicArray(): array
    {
        $logoPath = $this->logo_path ?: 'logo.png';
        $version = $this->updated_at?->timestamp ?? time();

        return array_merge(static::defaults(), $this->only($this->fillable), [
            'logo_url' => asset($logoPath) . '?v=' . $version,
            'version' => $version,
        ]);
    }

    public static function shared(): array
    {
        if (!Schema::hasTable('branding_settings')) {
            return static::publicDefaults();
        }

        return static::current()->toPublicArray();
    }
}
