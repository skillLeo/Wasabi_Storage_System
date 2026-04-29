<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('branding_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('branding_settings', 'logo_width_sidebar')) {
                $table->unsignedSmallInteger('logo_width_sidebar')->default(185)->after('logo_width_mobile');
            }
        });
    }

    public function down(): void
    {
        Schema::table('branding_settings', function (Blueprint $table) {
            if (Schema::hasColumn('branding_settings', 'logo_width_sidebar')) {
                $table->dropColumn('logo_width_sidebar');
            }
        });
    }
};
