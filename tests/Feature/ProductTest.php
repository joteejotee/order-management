<?php

namespace Tests\Feature;

use App\Models\Pen;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
  use RefreshDatabase;

  public function test_pens_index_endpoint_requires_authentication(): void
  {
    $response = $this->get('/api/pens');

    // 認証されていないので302リダイレクトが期待される
    $response->assertStatus(302);
  }

  public function test_authenticated_user_can_access_pens_index(): void
  {
    // ユーザーを作成して認証
    /** @var User $user */
    $user = User::factory()->create();

    // テスト用の商品を作成
    Pen::factory()->count(3)->create();

    $response = $this->actingAs($user, 'sanctum')->get('/api/pens');

    $response->assertStatus(200);

    // レスポンスがJSONであることを確認
    $response->assertHeader('content-type', 'application/json');

    // データが正しい構造で返されることを確認
    $response->assertJsonStructure([
      'data' => [
        'data' => [
          '*' => [
            'id',
            'name',
            'price',
            'stock',
            'created_at',
            'updated_at'
          ]
        ],
        'current_page',
        'from',
        'last_page',
        'per_page',
        'to',
        'total'
      ]
    ]);

    // ページネーションデータの確認
    $data = $response->json();
    $this->assertArrayHasKey('data', $data);
    $this->assertArrayHasKey('data', $data['data']); // ページネーション内のデータ
    $this->assertCount(3, $data['data']['data']); // 3つの商品が返される
  }

  public function test_pen_creation(): void
  {
    $penData = [
      'name' => 'テストペン',
      'price' => 1000,
      'stock' => 50
    ];

    $pen = Pen::create($penData);

    $this->assertDatabaseHas('pens', $penData);
    $this->assertEquals('テストペン', $pen->name);
    $this->assertEquals(1000, $pen->price);
    $this->assertEquals(50, $pen->stock);
  }

  public function test_pen_factory_works(): void
  {
    $pen = Pen::factory()->create([
      'name' => 'ファクトリーペン',
      'price' => 500
    ]);

    $this->assertDatabaseHas('pens', [
      'name' => 'ファクトリーペン',
      'price' => 500
    ]);
  }
}
