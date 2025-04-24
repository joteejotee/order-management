<?php

use Illuminate\Support\Facades\Route;
use App\Models\User;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Route::get('/check-session-driver', function () {
    return config('session.driver');
});

require __DIR__ . '/auth.php';
