<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\Admin\BrandingController as AdminBrandingController;
use App\Http\Controllers\Admin\SlotController as AdminSlotController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\SettingsController as AdminSettingsController;
use App\Http\Controllers\Employee\SlotController as EmployeeSlotController;
use Illuminate\Support\Facades\Route;

// Login
Route::get('/', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

Route::middleware('guest')->group(function () {
    Route::get('/forgot-password', [PasswordResetController::class, 'request'])->name('password.request');
    Route::post('/forgot-password', [PasswordResetController::class, 'email'])->name('password.email');
    Route::get('/reset-password/{token}', [PasswordResetController::class, 'reset'])->name('password.reset');
    Route::post('/reset-password', [PasswordResetController::class, 'update'])->name('password.update');
});

// Admin routes — all POST to avoid cPanel blocking DELETE/PUT
Route::middleware(['auth', \App\Http\Middleware\AdminMiddleware::class])
    ->prefix('admin')
    ->group(function () {
        Route::get('dashboard', [AdminUserController::class, 'dashboard'])->name('admin.dashboard');
        Route::get('progress', [AdminUserController::class, 'progress'])->name('admin.progress');

        Route::get('documents', [AdminSlotController::class, 'index'])->name('admin.slots');
        Route::post('documents', [AdminSlotController::class, 'store'])->name('admin.slots.store');
        Route::post('documents/{slot}/update', [AdminSlotController::class, 'update'])->name('admin.slots.update');
        Route::post('documents/{slot}/delete', [AdminSlotController::class, 'destroy'])->name('admin.slots.destroy');

        Route::get('users', [AdminUserController::class, 'index'])->name('admin.users');
        Route::post('users', [AdminUserController::class, 'store'])->name('admin.users.store');
        Route::post('users/{user}/update', [AdminUserController::class, 'update'])->name('admin.users.update');
        Route::post('users/{user}/delete', [AdminUserController::class, 'destroy'])->name('admin.users.destroy');
        Route::get('users/{user}', [AdminUserController::class, 'show'])->name('admin.users.show');

        Route::get('branding', [AdminBrandingController::class, 'edit'])->name('admin.branding');
        Route::post('branding', [AdminBrandingController::class, 'update'])->name('admin.branding.update');

        Route::get('settings', [AdminSettingsController::class, 'index'])->name('admin.settings');
        Route::post('settings/profile', [AdminSettingsController::class, 'updateProfile'])->name('admin.settings.profile');
        Route::post('settings/password', [AdminSettingsController::class, 'updatePassword'])->name('admin.settings.password');
    });

// Employee routes
Route::middleware(['auth', \App\Http\Middleware\EmployeeMiddleware::class])
    ->prefix('employee')
    ->group(function () {
        Route::get('documents', [EmployeeSlotController::class, 'index'])->name('employee.documents');
        Route::post('slots/{slotId}/upload', [EmployeeSlotController::class, 'upload'])->name('employee.upload');
    });
