<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;

Route::middleware(['auth:sanctum'])->group(function () {
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
  Route::put('/orders/{order:id}', 'App\Http\Controllers\OrderController@update');
  Route::get('/orders/{order}/edit', 'App\Http\Controllers\OrderController@edit');
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
  Log::info('API /user accessed', ['user' => $request->user()]);
  return response()->json(['data' => $request->user()]);
});

// 認証関連のルート
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login');
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');
