<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    // Orderモデルには、HasFactoryトレイトを使用するよう指示
    use HasFactory;
    // Orderモデルのfillable（ユーザー入力可能）プロパティに、order_id、customer_id、num、orderdayを指定
    protected $fillable = [
        // このorder_idは、Orderモデルのidを参照する
        'order_id',

        // このcustomer_idは、Customerモデルのidを参照する
        'customer_id',

        // このnumは、注文数を表す
        'num',

        // このorderdayは、注文日を表す
        'orderday',
    ];
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
}
