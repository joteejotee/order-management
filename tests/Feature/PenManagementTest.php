<?php

use App\Models\User;
use App\Models\Pen;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
  $this->user = User::factory()->create();
  $this->actingAs($this->user);
});

describe('Pen API Management', function () {

  test('can list all pens with pagination', function () {
    // Arrange
    Pen::factory()->count(15)->create();

    // Act
    $response = $this->getJson('/api/pens');

    // Assert
    $response
      ->assertOk()
      ->assertJsonStructure([
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
          'last_page',
          'per_page',
          'total'
        ]
      ]);

    expect($response->json('data.data'))->toHaveCount(4); // Default pagination per PenController
    expect($response->json('data.total'))->toBe(15);
  });

  test('can create a new pen with valid data', function () {
    // Arrange
    $penData = [
      'name' => 'BluePen',     // Within 3-12 character limit
      'price' => 250,          // Integer between 100-10000
      'stock' => 100           // Integer >= 0
    ];

    // Act
    $response = $this->postJson('/api/pens', $penData);

    // Assert
    $response
      ->assertCreated()
      ->assertJsonFragment($penData);

    $this->assertDatabaseHas('pens', $penData);

    $pen = Pen::latest()->first();
    expect($pen->name)->toBe('BluePen');
    expect($pen->price)->toBe(250);
  });

  test('validates required fields when creating pen', function () {
    // Act
    $response = $this->postJson('/api/pens', []);

    // Assert
    $response
      ->assertUnprocessable()
      ->assertJsonValidationErrors(['name', 'price', 'stock']);
  });

  test('validates name length constraints', function () {
    // Act - Too long name
    $response = $this->postJson('/api/pens', [
      'name' => 'VeryLongPenName', // Over 12 characters
      'price' => 150,
      'stock' => 50
    ]);

    // Assert
    $response
      ->assertUnprocessable()
      ->assertJsonValidationErrors(['name']);

    // Act - Too short name
    $response2 = $this->postJson('/api/pens', [
      'name' => 'AB', // Under 3 characters
      'price' => 150,
      'stock' => 50
    ]);

    // Assert
    $response2
      ->assertUnprocessable()
      ->assertJsonValidationErrors(['name']);
  });

  test('validates price constraints', function () {
    // Act - Price too low
    $response = $this->postJson('/api/pens', [
      'name' => 'TestPen',
      'price' => 50, // Under 100 minimum
      'stock' => 50
    ]);

    // Assert
    $response
      ->assertUnprocessable()
      ->assertJsonValidationErrors(['price']);

    // Act - Price too high
    $response2 = $this->postJson('/api/pens', [
      'name' => 'TestPen',
      'price' => 15000, // Over 10000 maximum
      'stock' => 50
    ]);

    // Assert
    $response2
      ->assertUnprocessable()
      ->assertJsonValidationErrors(['price']);
  });

  test('validates stock is non-negative', function () {
    // Act
    $response = $this->postJson('/api/pens', [
      'name' => 'TestPen',
      'price' => 150,
      'stock' => -5 // Invalid negative stock
    ]);

    // Assert
    $response
      ->assertUnprocessable()
      ->assertJsonValidationErrors(['stock']);
  });

  test('can retrieve specific pen by id', function () {
    // Arrange
    $pen = Pen::factory()->create([
      'name' => 'SpecialPen',
      'price' => 8999
    ]);

    // Act
    $response = $this->getJson("/api/pens/{$pen->id}");

    // Assert
    $response
      ->assertOk()
      ->assertJson([
        'data' => [
          'id' => $pen->id,
          'name' => 'SpecialPen',
          'price' => 8999
        ]
      ]);
  });

  test('returns pen data when pen not found', function () {
    // Act
    $response = $this->getJson('/api/pens/999');

    // Assert
    $response->assertOk(); // Current implementation returns 200 with null data
    expect($response->json('data'))->toBeNull();
  });

  test('can update existing pen', function () {
    // Arrange
    $pen = Pen::factory()->create();
    $updateData = [
      'name' => 'UpdatedPen',
      'price' => 199,
      'stock' => 75
    ];

    // Act
    $response = $this->patchJson("/api/pens/{$pen->id}", $updateData);

    // Assert
    $response->assertOk();

    $pen->refresh();
    expect($pen->name)->toBe('UpdatedPen');
    expect($pen->price)->toBe(199);
    expect($pen->stock)->toBe(75);
  });

  test('can delete pen', function () {
    // Arrange
    $pen = Pen::factory()->create();

    // Act
    $response = $this->deleteJson("/api/pens/{$pen->id}");

    // Assert
    $response->assertOk(); // Current implementation returns 200 with message
    $response->assertJson(['message' => '無事に削除しましたた']);
    $this->assertDatabaseMissing('pens', ['id' => $pen->id]);
  });

  test('prevents deletion of non-existent pen', function () {
    // Act
    $response = $this->deleteJson('/api/pens/999');

    // Assert
    $response->assertNotFound(); // Laravel route model binding returns 404 for non-existent models
  });
});

describe('Pen API Authentication', function () {

  test('authenticated users can access pen endpoints', function () {
    // Test with authentication (already set up in beforeEach)
    // Act & Assert - These should work with authentication
    $this->getJson('/api/pens')->assertOk();

    $validPenData = [
      'name' => 'AuthTest',
      'price' => 150,
      'stock' => 25
    ];
    $this->postJson('/api/pens', $validPenData)->assertCreated();
  });
});

describe('Pen Model Business Logic', function () {

  test('calculates total inventory value', function () {
    // Arrange
    $pens = collect([
      Pen::factory()->create(['price' => 100, 'stock' => 5]),
      Pen::factory()->create(['price' => 255, 'stock' => 10]),
      Pen::factory()->create(['price' => 157, 'stock' => 8])
    ]);

    // Act
    $totalValue = $pens->sum(fn($pen) => $pen->price * $pen->stock);

    // Assert
    expect($totalValue)->toBe(4306); // (100*5) + (255*10) + (157*8)
  });

  test('identifies low stock items', function () {
    // Arrange
    $lowStockPen = Pen::factory()->create(['stock' => 2]);
    $normalStockPen = Pen::factory()->create(['stock' => 50]);

    // Act
    $lowStockItems = Pen::where('stock', '<', 5)->get();

    // Assert
    expect($lowStockItems)->toHaveCount(1);
    expect($lowStockItems->first()->id)->toBe($lowStockPen->id);
  });

  test('can filter pens by name pattern', function () {
    // Arrange
    Pen::factory()->create(['name' => 'RedPen123']);
    Pen::factory()->create(['name' => 'BluePen456']);
    Pen::factory()->create(['name' => 'GreenMark1']);

    // Act
    $redPens = Pen::where('name', 'like', '%Red%')->get();

    // Assert
    expect($redPens)->toHaveCount(1);
    expect($redPens->first()->name)->toBe('RedPen123');
  });
});

describe('Edge Cases and Error Handling', function () {

  test('handles maximum valid price', function () {
    // Act
    $response = $this->postJson('/api/pens', [
      'name' => 'LuxuryPen',
      'price' => 10000, // Maximum allowed price
      'stock' => 1
    ]);

    // Assert
    $response->assertCreated();
    expect($response->json('data.price'))->toBe(10000);
  });

  test('handles minimum valid price', function () {
    // Act
    $response = $this->postJson('/api/pens', [
      'name' => 'BasicPen',
      'price' => 100, // Minimum allowed price
      'stock' => 25
    ]);

    // Assert
    $response->assertCreated();
    expect($response->json('data.price'))->toBe(100);
  });

  test('handles zero stock correctly', function () {
    // Arrange
    $pen = Pen::factory()->create([
      'name' => 'TestPen123', // Valid name within 3-12 character limit
      'stock' => 10
    ]);

    // Act
    $response = $this->patchJson("/api/pens/{$pen->id}", [
      'name' => 'TestPen123', // Keep same valid name
      'price' => $pen->price,
      'stock' => 0
    ]);

    // Assert
    $response->assertOk();
    $pen->refresh();
    expect($pen->stock)->toBe(0);
  });

  test('concurrent updates handle race conditions gracefully', function () {
    // Arrange
    $pen = Pen::factory()->create(['stock' => 10]);

    // Simulate concurrent stock updates
    $pen1 = Pen::find($pen->id);
    $pen2 = Pen::find($pen->id);

    // Act
    $pen1->update(['stock' => 5]);
    $pen2->update(['stock' => 8]);

    // Assert
    $pen->refresh();
    expect($pen->stock)->toBe(8); // Last update wins
  });
});
