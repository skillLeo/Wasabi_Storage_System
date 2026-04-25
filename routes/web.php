<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\SlotController as AdminSlotController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\SettingsController as AdminSettingsController;
use App\Http\Controllers\Employee\SlotController as EmployeeSlotController;
use Illuminate\Support\Facades\Route;

// Login
Route::get('/', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

// Admin routes — all POST to avoid cPanel blocking DELETE/PUT
Route::middleware(['auth', \App\Http\Middleware\AdminMiddleware::class])
    ->prefix('admin')
    ->group(function () {
        Route::get('dashboard', [AdminUserController::class, 'dashboard'])->name('admin.dashboard');

        Route::get('documents', [AdminSlotController::class, 'index'])->name('admin.slots');
        Route::post('documents', [AdminSlotController::class, 'store'])->name('admin.slots.store');
        Route::post('documents/{slot}/update', [AdminSlotController::class, 'update'])->name('admin.slots.update');
        Route::post('documents/{slot}/delete', [AdminSlotController::class, 'destroy'])->name('admin.slots.destroy');

        Route::get('users', [AdminUserController::class, 'index'])->name('admin.users');
        Route::post('users', [AdminUserController::class, 'store'])->name('admin.users.store');
        Route::post('users/{user}/update', [AdminUserController::class, 'update'])->name('admin.users.update');
        Route::post('users/{user}/delete', [AdminUserController::class, 'destroy'])->name('admin.users.destroy');
        Route::get('users/{user}', [AdminUserController::class, 'show'])->name('admin.users.show');

        Route::get('settings', [AdminSettingsController::class, 'index'])->name('admin.settings');
        Route::post('settings/profile', [AdminSettingsController::class, 'updateProfile'])->name('admin.settings.profile');
        Route::post('settings/password', [AdminSettingsController::class, 'updatePassword'])->name('admin.settings.password');
        Route::post('settings/logo', [AdminSettingsController::class, 'updateLogo'])->name('admin.settings.logo');
    });

// Employee routes
Route::middleware(['auth', \App\Http\Middleware\EmployeeMiddleware::class])
    ->prefix('employee')
    ->group(function () {
        Route::get('documents', [EmployeeSlotController::class, 'index'])->name('employee.documents');
        Route::post('slots/{slotId}/upload', [EmployeeSlotController::class, 'upload'])->name('employee.upload');
    });
