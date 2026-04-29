<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('branding_settings', function (Blueprint $table) {
            $table->id();
            $table->string('logo_path')->default('logo.png');
            $table->string('brand_color', 7)->default('#2d6ea0');
            $table->unsignedSmallInteger('logo_width_desktop')->default(260);
            $table->unsignedSmallInteger('logo_width_mobile')->default(220);
            $table->unsignedSmallInteger('logo_width_sidebar')->default(185);
            $table->string('logo_alt_text')->default('No One Left Behind');
            $table->string('login_headline')->default('Employee Document Portal');
            $table->string('login_subheading', 500)->default('Upload and manage your required company documents securely - all in one place.');
            $table->string('login_feature_one')->default('Secure cloud storage');
            $table->string('login_feature_two')->default('Upload in seconds');
            $table->string('login_feature_three')->default('Track your progress');
            $table->string('login_form_title')->default('Welcome back');
            $table->string('login_form_subtitle')->default('Sign in to access your documents');
            $table->string('login_email_label')->default('Email address');
            $table->string('login_email_placeholder')->default('you@company.com');
            $table->string('login_password_label')->default('Password');
            $table->string('login_password_placeholder')->default('Password');
            $table->string('login_submit_text')->default('Sign in');
            $table->string('login_submitting_text')->default('Signing in...');
            $table->string('login_help_text')->default('Need access? Contact your administrator.');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('branding_settings');
    }
};
