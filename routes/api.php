<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\SalesController;

Route::middleware(['auth:sanctum'])->group(function () {
  // 固定パスのルートを先に定義
  Route::get('/orders/status-summary', 'App\Http\Controllers\OrderController@statusSummary');
  Route::get('/orders/create', 'App\Http\Controllers\OrderController@create');

  // その後でパラメータを含むルートを定義
  Route::get('/orders', 'App\Http\Controllers\OrderController@index');
  Route::post('/orders', 'App\Http\Controllers\OrderController@store');
  Route::get('/orders/{order:id}', 'App\Http\Controllers\OrderController@edit');
  Route::patch('/orders/{order:id}', 'App\Http\Controllers\OrderController@update');
  Route::delete('/orders/{order:id}', 'App\Http\Controllers\OrderController@delete');
  Route::put('/orders/{order:id}', 'App\Http\Controllers\OrderController@update');
  Route::get('/orders/{order}/edit', 'App\Http\Controllers\OrderController@edit');

  // 他のDashboardルート
  Route::get('/products/total', 'App\Http\Controllers\ProductController@total');
  Route::get('/products/out-of-stock', 'App\Http\Controllers\ProductController@outOfStock');
  Route::get('/products/low-stock', 'App\Http\Controllers\ProductController@lowStock');
  Route::get('/sales/top-weekly', 'App\Http\Controllers\SalesController@topWeekly');
  Route::get('/sales/monthly', 'App\Http\Controllers\SalesController@monthly');
  Route::get('/sales/weekly', 'App\Http\Controllers\SalesController@weekly');

  Route::get('/pens', 'App\Http\Controllers\PenController@index'); //一覧を取得
  Route::post('/pens', 'App\Http\Controllers\PenController@store'); //登録
  Route::get('/pens/{pen:id}', 'App\Http\Controllers\PenController@edit'); //指定のデータのみ取得
  Route::patch('/pens/{pen:id}', 'App\Http\Controllers\PenController@update'); //指定のデータを更新
  Route::delete('/pens/{pen}', 'App\Http\Controllers\PenController@delete'); //指定のデータを削除
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
  Log::info('API /user accessed', ['user' => $request->user()]);
  return response()->json(['data' => $request->user()]);
});

// 認証関連のルート
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login');
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');
