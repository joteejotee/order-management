<?php

namespace Tests\Browser;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class UserAuthenticationJourneyTest extends DuskTestCase
{
  use RefreshDatabase;

  protected string $frontendUrl = 'http://localhost:3000';

  /**
   * Complete user registration flow test
   */
  public function test_user_can_complete_registration_flow(): void
  {
    $this->browse(function (Browser $browser) {
      $browser->visit($this->frontendUrl . '/register')
        ->assertSee('Register')
        ->type('name', 'John Doe')
        ->type('email', 'john@example.com')
        ->type('password', 'SecurePassword123!')
        ->type('password_confirmation', 'SecurePassword123!')
        ->press('Register')
        ->waitForLocation('/dashboard', 10)
        ->assertPathIs('/dashboard')
        ->assertSee('Dashboard');

      // Verify user was created in database
      $this->assertDatabaseHas('users', [
        'name' => 'John Doe',
        'email' => 'john@example.com'
      ]);
    });
  }

  /**
   * User login and dashboard access test
   */
  public function test_user_can_login_and_access_dashboard(): void
  {
    // Arrange
    $user = User::factory()->create([
      'email' => 'test@example.com',
      'password' => bcrypt('password123')
    ]);

    $this->browse(function (Browser $browser) use ($user) {
      $browser->visit($this->frontendUrl . '/login')
        ->assertSee('Log in')
        ->type('email', 'test@example.com')
        ->type('password', 'password123')
        ->press('Log in')
        ->waitForLocation('/dashboard', 10)
        ->assertPathIs('/dashboard')
        ->assertSee('Dashboard')
        ->assertSee($user->name);
    });
  }

  /**
   * Authentication validation error handling test
   */
  public function test_displays_validation_errors_for_invalid_login(): void
  {
    $this->browse(function (Browser $browser) {
      $browser->visit($this->frontendUrl . '/login')
        ->type('email', 'invalid@example.com')
        ->type('password', 'wrongpassword')
        ->press('Log in')
        ->waitFor('.text-red-600', 5) // Wait for error message
        ->assertSee('These credentials do not match our records')
        ->assertPathIs('/login'); // Should remain on login page
    });
  }

  /**
   * Registration form validation test
   */
  public function test_displays_validation_errors_for_invalid_registration(): void
  {
    $this->browse(function (Browser $browser) {
      $browser->visit($this->frontendUrl . '/register')
        ->press('Register') // Submit empty form
        ->waitFor('.text-red-600', 5)
        ->assertSee('The name field is required')
        ->assertSee('The email field is required')
        ->assertSee('The password field is required')
        ->assertPathIs('/register');
    });
  }

  /**
   * Password mismatch validation test
   */
  public function test_displays_password_confirmation_error(): void
  {
    $this->browse(function (Browser $browser) {
      $browser->visit($this->frontendUrl . '/register')
        ->type('name', 'John Doe')
        ->type('email', 'john@example.com')
        ->type('password', 'SecurePassword123!')
        ->type('password_confirmation', 'DifferentPassword!')
        ->press('Register')
        ->waitFor('.text-red-600', 5)
        ->assertSee('The password field confirmation does not match')
        ->assertPathIs('/register');
    });
  }

  /**
   * User logout functionality test
   */
  public function test_user_can_logout_successfully(): void
  {
    // Arrange
    $user = User::factory()->create([
      'email' => 'test@example.com',
      'password' => bcrypt('password123')
    ]);

    $this->browse(function (Browser $browser) use ($user) {
      // Login first
      $browser->visit($this->frontendUrl . '/login')
        ->type('email', 'test@example.com')
        ->type('password', 'password123')
        ->press('Log in')
        ->waitForLocation('/dashboard', 10)
        ->assertPathIs('/dashboard');

      // Then logout
      $browser->clickLink('Logout')
        ->waitForLocation('/', 10)
        ->assertPathIs('/')
        ->assertSee('Login'); // Should see login link again
    });
  }

  /**
   * Protected route access test (dashboard requires auth)
   */
  public function test_unauthenticated_user_cannot_access_dashboard(): void
  {
    $this->browse(function (Browser $browser) {
      $browser->visit($this->frontendUrl . '/dashboard')
        ->waitForLocation('/login', 10)
        ->assertPathIs('/login')
        ->assertSee('Log in');
    });
  }

  /**
   * Navigation flow test - guest to authenticated user
   */
  public function test_navigation_changes_based_on_authentication_state(): void
  {
    $user = User::factory()->create([
      'email' => 'test@example.com',
      'password' => bcrypt('password123')
    ]);

    $this->browse(function (Browser $browser) use ($user) {
      // Start as guest
      $browser->visit($this->frontendUrl)
        ->assertSee('Login')
        ->assertSee('Register');

      // Login
      $browser->clickLink('Login')
        ->type('email', 'test@example.com')
        ->type('password', 'password123')
        ->press('Log in')
        ->waitForLocation('/dashboard', 10);

      // Check authenticated navigation
      $browser->visit($this->frontendUrl)
        ->assertSee('Dashboard')
        ->assertDontSee('Login') // Should not see login link when authenticated
        ->assertDontSee('Register');
    });
  }

  /**
   * Session persistence test
   */
  public function test_user_session_persists_across_page_refreshes(): void
  {
    $user = User::factory()->create([
      'email' => 'test@example.com',
      'password' => bcrypt('password123')
    ]);

    $this->browse(function (Browser $browser) use ($user) {
      // Login
      $browser->visit($this->frontendUrl . '/login')
        ->type('email', 'test@example.com')
        ->type('password', 'password123')
        ->press('Log in')
        ->waitForLocation('/dashboard', 10);

      // Refresh page and verify still authenticated
      $browser->refresh()
        ->waitFor('h1', 5) // Wait for page to load
        ->assertPathIs('/dashboard')
        ->assertSee('Dashboard')
        ->assertSee($user->name);

      // Navigate to different authenticated page and back
      $browser->visit($this->frontendUrl . '/dashboard')
        ->assertSee($user->name);
    });
  }

  /**
   * Form submission error handling test
   */
  public function test_handles_server_errors_gracefully(): void
  {
    $this->browse(function (Browser $browser) {
      // Try to register with existing email
      User::factory()->create(['email' => 'existing@example.com']);

      $browser->visit($this->frontendUrl . '/register')
        ->type('name', 'John Doe')
        ->type('email', 'existing@example.com')
        ->type('password', 'SecurePassword123!')
        ->type('password_confirmation', 'SecurePassword123!')
        ->press('Register')
        ->waitFor('.text-red-600', 5)
        ->assertSee('The email has already been taken')
        ->assertPathIs('/register');
    });
  }

  /**
   * Responsive design test - mobile layout
   */
  public function test_login_form_works_on_mobile_viewport(): void
  {
    $user = User::factory()->create([
      'email' => 'test@example.com',
      'password' => bcrypt('password123')
    ]);

    $this->browse(function (Browser $browser) use ($user) {
      $browser->resize(375, 667) // iPhone 6/7/8 viewport
        ->visit($this->frontendUrl . '/login')
        ->assertSee('Log in')
        ->type('email', 'test@example.com')
        ->type('password', 'password123')
        ->press('Log in')
        ->waitForLocation('/dashboard', 10)
        ->assertPathIs('/dashboard');
    });
  }

  /**
   * Accessibility test - keyboard navigation
   */
  public function test_login_form_supports_keyboard_navigation(): void
  {
    $this->browse(function (Browser $browser) {
      $browser->visit($this->frontendUrl . '/login')
        ->assertSee('Log in');

      // Tab through form fields
      $browser->keys('#email', ['{tab}']) // Focus email field and tab to password
        ->assertFocused('#password')
        ->keys('#password', ['{tab}']) // Tab to submit button
        ->assertPresent('button[type="submit"]:focus'); // Verify button is focused
    });
  }

  /**
   * Loading state and UI feedback test
   */
  public function test_shows_loading_state_during_form_submission(): void
  {
    $this->browse(function (Browser $browser) {
      $browser->visit($this->frontendUrl . '/login')
        ->type('email', 'test@example.com')
        ->type('password', 'password123')
        ->press('Log in')
        ->waitUntilMissing('.loading', 10); // Assuming loading indicator exists
    });
  }

  /**
   * Multi-step user journey test
   */
  public function test_complete_user_journey_from_guest_to_dashboard_usage(): void
  {
    $this->browse(function (Browser $browser) {
      // Start as guest, navigate to register
      $browser->visit($this->frontendUrl)
        ->clickLink('Register')
        ->assertPathIs('/register');

      // Complete registration
      $browser->type('name', 'Jane Smith')
        ->type('email', 'jane@example.com')
        ->type('password', 'SecurePassword123!')
        ->type('password_confirmation', 'SecurePassword123!')
        ->press('Register')
        ->waitForLocation('/dashboard', 10);

      // Use dashboard functionality
      $browser->assertSee('Dashboard')
        ->assertSee('Jane Smith');

      // Logout and verify redirect
      $browser->clickLink('Logout')
        ->waitForLocation('/', 10)
        ->assertPathIs('/')
        ->assertSee('Login');

      // Login again with created account
      $browser->clickLink('Login')
        ->type('email', 'jane@example.com')
        ->type('password', 'SecurePassword123!')
        ->press('Log in')
        ->waitForLocation('/dashboard', 10)
        ->assertSee('Jane Smith');
    });
  }
}
