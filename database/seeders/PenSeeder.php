<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents; //Seederを使うためのもの
use Illuminate\Database\Seeder; //Seederを使うためのもの
use Illuminate\Support\Facades\DB; //DBを扱うためのもの
use Carbon\Carbon; //日付を扱うためのもの

class PenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void //Seederを実行するためのメソッド
    {
        $pens = [ //挿入するデータ
            ['name' => '黒ボールペン', 'price' => 201],
            ['name' => '赤ボールペン', 'price' => 202],
            ['name' => '青ボールペン', 'price' => 203],
            ['name' => '緑ボールペン', 'price' => 204],
            ['name' => '紫ボールペン', 'price' => 205],
            ['name' => '黒シャープペン', 'price' => 206],
            ['name' => '赤シャープペン', 'price' => 207],
            ['name' => '青シャープペン', 'price' => 208],
            ['name' => '緑シャープペン', 'price' => 209],
            ['name' => '紫シャープペン', 'price' => 210],
        ];
        foreach ($pens as $pen) { //データを1つずつ取り出して繰り返す
            DB::table('pens')->insert([ //pensテーブルにデータを挿入
                'name' => $pen['name'], //nameカラムに$pen['name']を挿入
                'price' => $pen['price'], //priceカラムに$pen['price']を挿入
                'created_at' => Carbon::now(), //created_atカラムに現在時刻を挿入
                'updated_at' => Carbon::now() //updated_atカラムに現在時刻を挿入
            ]);
        }
    }
}
