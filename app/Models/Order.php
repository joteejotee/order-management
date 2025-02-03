<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Order extends Model
{
  // Orderモデルには、HasFactoryトレイトを使用するよう指示
  use HasFactory;
  // Orderモデルのfillable（ユーザー入力可能）プロパティに、customer_id、pen_id、num、orderdayを指定
  protected $fillable = [
    // このcustomer_idは、Customerモデルのidを参照する
    'customer_id',

    // このpen_idは、Penモデルのidを参照する
    'pen_id',

    // このnumは、注文数を表す
    'num',

    // このorderdayは、注文日を表す
    'orderday',
  ];

  // アクセサを追加
  public function getOrderdayFormattedAttribute()
  {
    return Carbon::parse($this->orderday)->format('Y-m-d H:i');
  }

  public function customer()
  {
    // OrderモデルからCustomerモデルへのリレーションを定義
    return $this->belongsTo(Customer::class);
  }
  public function pen()
  {
    // OrderモデルからPenモデルへのリレーションを定義
    return $this->belongsTo(Pen::class);
  }

  // インデックスの定義
  protected static function boot()
  {
    parent::boot();

    static::addGlobalScope('order', function ($query) {
      $query->orderBy('id', 'desc');
    });
  }
}
