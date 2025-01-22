<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Route::middleware(['web'])->group(function () {
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
    Route::post('/api/login', [AuthenticatedSessionController::class, 'store']);

    Route::get('/sanctum/csrf-cookie', function () {
        return response()->json(['message' => 'CSRF route hit']);
    });
});

Route::middleware(['web', 'auth:sanctum'])->get('/api/user', function (Request $request) {
    return $request->user();
});

Route::get('/debug-session', function (Request $request) {
    return response()->json([
        'cookies' => $request->cookies->all(),
        'session' => session()->all(),
        'user' => Auth::user(),
        'guard_check' => Auth::guard('web')->check(),
        'headers' => $request->headers->all(),
    ]);
});

require __DIR__.'/auth.php';
