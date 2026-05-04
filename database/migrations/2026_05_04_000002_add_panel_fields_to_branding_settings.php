<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('branding_settings', function (Blueprint $table) {
            $table->string('forgot_panel_headline')->default('Forgot your password?')->after('forgot_title');
            $table->string('forgot_panel_subheading', 300)->default('Enter your email and we\'ll send you reset instructions to get you back in.')->after('forgot_panel_headline');
        });
    }

    public function down(): void
    {
        Schema::table('branding_settings', function (Blueprint $table) {
            $table->dropColumn(['forgot_panel_headline', 'forgot_panel_subheading']);
        });
    }
};
