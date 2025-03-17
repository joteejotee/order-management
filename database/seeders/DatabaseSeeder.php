<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // テストユーザーの作成
        User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('Test1234'),
        ]);

        // 既存のCustomerSeederを実行
        $this->call([
            CustomerSeeder::class,
            PenSeeder::class, // PenSeederを追加
            OrderSeeder::class, // OrderSeederを追加
        ]);
    }
}