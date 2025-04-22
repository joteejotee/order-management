<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 既存のシーダーを実行
        $this->call([
            UserSeeder::class,
            CustomerSeeder::class,
            PenSeeder::class,
            OrderSeeder::class,
        ]);
    }
}
