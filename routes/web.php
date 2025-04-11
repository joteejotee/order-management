<?php

use Illuminate\Support\Facades\Route;
use App\Models\User;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Route::get('/check-session-driver', function () {
    return config('session.driver');
});

Route::get('/debug-user', function () {
    return User::where('email', 'test@example.com')->first() ?? 'ユーザーが存在しません';
});

require __DIR__.'/auth.php';
