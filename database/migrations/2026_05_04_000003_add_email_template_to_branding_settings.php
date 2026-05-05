<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('branding_settings', function (Blueprint $table) {
            $table->string('email_reset_subject')->default('Reset Your Password')->after('reset_back_text');
            $table->string('email_reset_greeting')->default('Hello!')->after('email_reset_subject');
            $table->string('email_reset_intro', 500)->default('You are receiving this email because we received a password reset request for your account.')->after('email_reset_greeting');
            $table->string('email_reset_button')->default('Reset Password')->after('email_reset_intro');
            $table->string('email_reset_expire', 300)->default('This password reset link will expire in 60 minutes.')->after('email_reset_button');
            $table->string('email_reset_no_action', 300)->default('If you did not request a password reset, no further action is required.')->after('email_reset_expire');
        });
    }

    public function down(): void
    {
        Schema::table('branding_settings', function (Blueprint $table) {
            $table->dropColumn([
                'email_reset_subject',
                'email_reset_greeting',
                'email_reset_intro',
                'email_reset_button',
                'email_reset_expire',
                'email_reset_no_action',
            ]);
        });
    }
};
