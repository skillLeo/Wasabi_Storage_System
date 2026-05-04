<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('branding_settings', function (Blueprint $table) {
            // Login page
            $table->string('login_forgot_password_text')->default('Forgot password?')->after('login_help_text');

            // Forgot password page
            $table->string('forgot_title')->default('Forgot password?')->after('login_forgot_password_text');
            $table->string('forgot_subtitle', 300)->default('Enter your email and we will send you a reset link.')->after('forgot_title');
            $table->string('forgot_email_label')->default('Email address')->after('forgot_subtitle');
            $table->string('forgot_email_placeholder')->default('you@company.com')->after('forgot_email_label');
            $table->string('forgot_submit_text')->default('Send Reset Link')->after('forgot_email_placeholder');
            $table->string('forgot_submitting_text')->default('Sending link...')->after('forgot_submit_text');
            $table->string('forgot_back_text')->default('Back to sign in')->after('forgot_submitting_text');

            // Reset password page
            $table->string('reset_badge_text')->default('Secure account')->after('forgot_back_text');
            $table->string('reset_title')->default('Reset password')->after('reset_badge_text');
            $table->string('reset_description', 300)->default('Create a new password for this account. The email is locked from the reset link.')->after('reset_title');
            $table->string('reset_email_label')->default('Account email')->after('reset_description');
            $table->string('reset_new_password_label')->default('New password')->after('reset_email_label');
            $table->string('reset_new_password_placeholder')->default('Min. 8 characters')->after('reset_new_password_label');
            $table->string('reset_confirm_label')->default('Confirm password')->after('reset_new_password_placeholder');
            $table->string('reset_confirm_placeholder')->default('Repeat new password')->after('reset_confirm_label');
            $table->string('reset_submit_text')->default('Reset Password')->after('reset_confirm_placeholder');
            $table->string('reset_submitting_text')->default('Resetting...')->after('reset_submit_text');
            $table->string('reset_back_text')->default('Back to sign in')->after('reset_submitting_text');
        });
    }

    public function down(): void
    {
        Schema::table('branding_settings', function (Blueprint $table) {
            $table->dropColumn([
                'login_forgot_password_text',
                'forgot_title',
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
            ]);
        });
    }
};
