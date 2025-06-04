<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Notification;
use Illuminate\Auth\Notifications\ResetPassword;

uses(RefreshDatabase::class);

describe('User Authentication', function () {

  test('can login with valid credentials', function () {
    // Arrange
    $user = User::factory()->create([
      'email' => 'test@example.com',
      'password' => bcrypt('ValidPassword123!')
    ]);

    // Act
    $response = $this->postJson('/api/login', [
      'email' => 'test@example.com',
      'password' => 'ValidPassword123!'
    ]);

    // Assert
    $response->assertStatus(204);
    $this->assertAuthenticated();
    $this->assertAuthenticatedAs($user);
  });

  test('rejects invalid login credentials', function () {
    // Arrange
    User::factory()->create([
      'email' => 'test@example.com',
      'password' => bcrypt('ValidPassword123!')
    ]);

    // Act
    $response = $this->postJson('/api/login', [
      'email' => 'test@example.com',
      'password' => 'WrongPassword!'
    ]);

    // Assert
    $response->assertUnprocessable();
    $this->assertGuest();
  });

  test('validates required login fields', function () {
    // Act
    $response = $this->postJson('/api/login', []);

    // Assert
    $response
      ->assertUnprocessable()
      ->assertJsonValidationErrors(['email', 'password']);
  });

  test('validates email format', function () {
    // Act
    $response = $this->postJson('/api/login', [
      'email' => 'invalid-email',
      'password' => 'password123'
    ]);

    // Assert
    $response
      ->assertUnprocessable()
      ->assertJsonValidationErrors(['email']);
  });

  test('can logout authenticated user', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    // Act
    $response = $this->postJson('/api/logout');

    // Assert
    $response->assertStatus(204);
    $this->assertGuest();
  });

  test('logout requires authentication', function () {
    // Act
    $response = $this->postJson('/api/logout');

    // Assert
    $response->assertUnauthorized();
  });
});

describe('User API Access', function () {

  test('authenticated user can access user endpoint', function () {
    // Arrange
    $user = User::factory()->create([
      'name' => 'John Doe',
      'email' => 'john@example.com'
    ]);
    $this->actingAs($user);

    // Act
    $response = $this->getJson('/api/user');

    // Assert
    $response
      ->assertOk()
      ->assertJson([
        'data' => [
          'id' => $user->id,
          'name' => 'John Doe',
          'email' => 'john@example.com'
        ]
      ]);
  });

  test('unauthenticated user cannot access user endpoint', function () {
    // Act
    $response = $this->getJson('/api/user');

    // Assert
    $response->assertUnauthorized();
  });
});

describe('Session Management', function () {

  test('session persists across requests', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    // Act
    $response1 = $this->getJson('/api/user');
    $response2 = $this->getJson('/api/user');

    // Assert
    $response1->assertOk();
    $response2->assertOk();
    expect($response1->json('data.id'))->toBe($response2->json('data.id'));
  });

  test('invalidates session on logout', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    // Act - Login and verify access
    $this->getJson('/api/user')->assertOk();

    // Logout
    $this->postJson('/api/logout');

    // Try to access authenticated endpoint
    $response = $this->getJson('/api/user');

    // Assert
    $response->assertUnauthorized();
  });
});

describe('Rate Limiting', function () {

  test('enforces login rate limiting', function () {
    // Arrange
    $user = User::factory()->create(['email' => 'test@example.com']);

    // Act - Make multiple failed login attempts
    for ($i = 0; $i < 6; $i++) {
      $this->postJson('/api/login', [
        'email' => 'test@example.com',
        'password' => 'wrong-password'
      ]);
    }

    // Final attempt
    $response = $this->postJson('/api/login', [
      'email' => 'test@example.com',
      'password' => 'wrong-password'
    ]);

    // Assert
    $response
      ->assertStatus(429); // Too Many Requests
  });
});

describe('Security Features', function () {

  test('passwords are hashed in database', function () {
    // Arrange
    $plainPassword = 'SecurePassword123!';

    // Act
    $user = User::factory()->create([
      'email' => 'test@example.com',
      'password' => bcrypt($plainPassword)
    ]);

    // Assert
    $freshUser = User::where('email', 'test@example.com')->first();
    expect($freshUser->password)->not->toBe($plainPassword);
    expect(Hash::check($plainPassword, $freshUser->password))->toBeTrue();
  });

  test('sensitive data is not exposed in api responses', function () {
    // Arrange
    $user = User::factory()->create();
    $this->actingAs($user);

    // Act
    $response = $this->getJson('/api/user');

    // Assert
    $response->assertOk();
    $userData = $response->json('data');
    expect($userData)->not->toHaveKey('password');
    expect($userData)->not->toHaveKey('remember_token');
  });

  test('email verification status is included in user data', function () {
    // Arrange
    $user = User::factory()->create(['email_verified_at' => now()]);
    $this->actingAs($user);

    // Act
    $response = $this->getJson('/api/user');

    // Assert
    $response
      ->assertOk()
      ->assertJsonStructure([
        'data' => [
          'id',
          'name',
          'email',
          'email_verified_at',
          'created_at',
          'updated_at'
        ]
      ]);
  });

  test('handles concurrent login attempts gracefully', function () {
    // Arrange
    $user = User::factory()->create([
      'email' => 'test@example.com',
      'password' => bcrypt('password123')
    ]);

    // Act - Simulate concurrent login attempts
    $responses = collect(range(1, 3))->map(function () use ($user) {
      return $this->postJson('/api/login', [
        'email' => 'test@example.com',
        'password' => 'password123'
      ]);
    });

    // Assert - All should succeed (no race condition issues)
    $responses->each(function ($response) {
      expect($response->status())->toBe(204);
    });
  });
});
