<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\SlotController as AdminSlotController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Employee\SlotController as EmployeeSlotController;
use Illuminate\Support\Facades\Route;

// Public auth routes
Route::post('/login', [AuthController::class, 'login']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Admin routes
    Route::middleware(\App\Http\Middleware\AdminMiddleware::class)
        ->prefix('admin')
        ->group(function () {
            Route::apiResource('slots', AdminSlotController::class)->except(['show']);
            Route::get('users', [AdminUserController::class, 'index']);
            Route::post('users', [AdminUserController::class, 'store']);
            Route::put('users/{user}', [AdminUserController::class, 'update']);
            Route::delete('users/{user}', [AdminUserController::class, 'destroy']);
            Route::get('users/{user}/slots', [AdminUserController::class, 'slots']);
        });

    // Employee routes
    Route::middleware(\App\Http\Middleware\EmployeeMiddleware::class)
        ->prefix('employee')
        ->group(function () {
            Route::get('slots', [EmployeeSlotController::class, 'index']);
            Route::post('slots/{slotId}/upload', [EmployeeSlotController::class, 'upload']);
        });
});
