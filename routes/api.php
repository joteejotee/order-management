<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Auth;

Route::options('/{any}', function (Request $request) {
    return response()->json('OK', 200);
})->where('any', '.*');

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('guest');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth:sanctum');

Route::middleware(['web', 'auth:sanctum'])->get('/user', function (Request $request) {
  return $request->user();
});

Route::get('/pens', 'App\Http\Controllers\PenController@index'); //一覧を取得
Route::post('/pens', 'App\Http\Controllers\PenController@store'); //登録
Route::get('/pens/{pen:id}', 'App\Http\Controllers\PenController@edit'); //指定のデータのみ取得
Route::patch('/pens/{pen:id}', 'App\Http\Controllers\PenController@update'); //指定のデータを更新
Route::delete('/pens/{pen:id}', 'App\Http\Controllers\PenController@delete'); //指定のデータを削除

Route::get('/orders', 'App\Http\Controllers\OrderController@index');
Route::get('/orders/create', 'App\Http\Controllers\OrderController@create');
Route::post('/orders', 'App\Http\Controllers\OrderController@store');
Route::get('/orders/{order:id}', 'App\Http\Controllers\OrderController@edit');
Route::patch('/orders/{order:id}', 'App\Http\Controllers\OrderController@update');
Route::delete('/orders/{order:id}', 'App\Http\Controllers\OrderController@delete');
Route::put('/orders/{order:id}', 'App\Http\Controllers\OrderController@ship');

Route::get('/auth-check', function (Request $request) {
    return response()->json([
        'sanctum_check' => Auth::guard('sanctum')->check(),
        'web_check' => Auth::guard('web')->check(),
        'user' => Auth::user(),
        'request_user' => $request->user(),
    ]);
});
