<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('branding_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('branding_settings', 'brand_color')) {
                $table->string('brand_color', 7)->default('#2d6ea0')->after('logo_path');
            }
        });
    }

    public function down(): void
    {
        Schema::table('branding_settings', function (Blueprint $table) {
            if (Schema::hasColumn('branding_settings', 'brand_color')) {
                $table->dropColumn('brand_color');
            }
        });
    }
};
