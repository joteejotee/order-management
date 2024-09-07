<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/pens', 'App\Http\Controllers\PenController@index'); //一覧表示
Route::post('/pens', 'App\Http\Controllers\PenController@store'); //登録
Route::get('/pens/{pen:id}', 'App\Http\Controllers\PenController@edit'); //指定のデータのみ取得
Route::patch('/pens/{pen:id}', 'App\Http\Controllers\PenController@update'); //指定のデータを更新
Route::delete('/pens/{pen:id}', 'App\Http\Controllers\PenController@delete'); //指定のデータを削除

Route::get('/orders', 'App\Http\Controllers\OrderController@index');
Route::post('/orders', 'App\Http\Controllers\OrderController@store');
Route::get('/orders/{order:id}', 'App\Http\Controllers\OrderController@edit');
Route::patch('/orders/{order:id}', 'App\Http\Controllers\OrderController@update');
Route::delete('/orders/{order:id}', 'App\Http\Controllers\OrderController@delete');
