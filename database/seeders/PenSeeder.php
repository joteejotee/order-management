<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder; //Seederを使うためのもの
use Illuminate\Support\Facades\DB; //DBを扱うためのもの
use Carbon\Carbon; //日付を扱うためのもの
use Illuminate\Support\Facades\Log;

class PenSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void //Seederを実行するためのメソッド
  {
    Log::info('PenSeeder実行: ' . now());

    // 文字コードを明示的に設定（MySQL接続時のみ）
    if (DB::getDriverName() === 'mysql') {
      DB::statement('SET FOREIGN_KEY_CHECKS=0'); // FK無効化
      DB::table('pens')->truncate();
      DB::statement('SET FOREIGN_KEY_CHECKS=1'); // FK再有効化
    }

    $pens = [ //挿入するデータ
      ['name' => '黒ボールペン', 'price' => 201, 'stock' => 0],
      ['name' => '赤マーカー', 'price' => 202, 'stock' => 0],
      ['name' => '青ボールペン', 'price' => 203, 'stock' => 5],
      ['name' => '緑マーカー', 'price' => 204, 'stock' => 8],
      ['name' => '紫ボールペン', 'price' => 205, 'stock' => 12],
      ['name' => '黒マーカー', 'price' => 206, 'stock' => 3],
      ['name' => '赤ボールペン', 'price' => 207, 'stock' => 7],
      ['name' => '青マーカー', 'price' => 208, 'stock' => 2],
      ['name' => '緑ボールペン', 'price' => 209, 'stock' => 10],
      ['name' => '紫マーカー', 'price' => 210, 'stock' => 15],
    ];
    foreach ($pens as $pen) { //データを1つずつ取り出して繰り返す
      DB::table('pens')->insert([ //pensテーブルにデータを挿入
        'name' => $pen['name'], //nameカラムに$pen['name']を挿入
        'price' => $pen['price'], //priceカラムに$pen['price']を挿入
        'stock' => $pen['stock'], //stockカラムに$pen['stock']を挿入
        'created_at' => Carbon::now(), //created_atカラムに現在時刻を挿入
        'updated_at' => Carbon::now() //updated_atカラムに現在時刻を挿入
      ]);
    }
  }
}
