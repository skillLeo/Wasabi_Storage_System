<?php

namespace App\Providers;

use App\Support\WindowsSafeFilesystem;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton('files', fn () => new WindowsSafeFilesystem);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Lower bcrypt cost on Windows/XAMPP to avoid max_execution_time timeout
        Hash::setRounds(10);
    }
}
