<?php

namespace Tests\Browser;

use App\Models\User;
use App\Models\Pen;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class PenManagementWorkflowTest extends DuskTestCase
{
  use RefreshDatabase;

  protected string $frontendUrl = 'http://localhost:3000';
  protected User $user;

  protected function setUp(): void
  {
    parent::setUp();

    // Create and authenticate a user for each test
    $this->user = User::factory()->create([
      'email' => 'admin@example.com',
      'password' => bcrypt('password123')
    ]);
  }

  /**
   * Test complete pen creation workflow
   */
  public function test_admin_can_create_new_pen_through_ui(): void
  {
    $this->browse(function (Browser $browser) {
      $this->loginUser($browser);

      $browser->visit($this->frontendUrl . '/dashboard/pens')
        ->assertSee('Pen Management')
        ->clickLink('Add New Pen')
        ->waitFor('#pen-form', 5)
        ->type('#name', 'Premium Gold Fountain Pen')
        ->select('#type', 'Fountain')
        ->select('#color', 'Gold')
        ->type('#price', '299.99')
        ->type('#stock_quantity', '25')
        ->press('Create Pen')
        ->waitFor('.success-message', 10)
        ->assertSee('Pen created successfully')
        ->assertSee('Premium Gold Fountain Pen');

      // Verify pen was created in database
      $this->assertDatabaseHas('pens', [
        'name' => 'Premium Gold Fountain Pen',
        'type' => 'Fountain',
        'color' => 'Gold',
        'price' => 299.99,
        'stock_quantity' => 25
      ]);
    });
  }

  /**
   * Test pen editing workflow
   */
  public function test_admin_can_edit_existing_pen(): void
  {
    // Arrange
    $pen = Pen::factory()->create([
      'name' => 'Basic Blue Pen',
      'type' => 'Ballpoint',
      'color' => 'Blue',
      'price' => 15.99,
      'stock_quantity' => 100
    ]);

    $this->browse(function (Browser $browser) use ($pen) {
      $this->loginUser($browser);

      $browser->visit($this->frontendUrl . '/dashboard/pens')
        ->assertSee('Basic Blue Pen')
        ->click("@edit-pen-{$pen->id}")
        ->waitFor('#pen-form', 5)
        ->clear('#name')
        ->type('#name', 'Premium Blue Ballpoint')
        ->clear('#price')
        ->type('#price', '25.99')
        ->clear('#stock_quantity')
        ->type('#stock_quantity', '75')
        ->press('Update Pen')
        ->waitFor('.success-message', 10)
        ->assertSee('Pen updated successfully')
        ->assertSee('Premium Blue Ballpoint')
        ->assertSee('$25.99');

      // Verify changes in database
      $pen->refresh();
      $this->assertEquals('Premium Blue Ballpoint', $pen->name);
      $this->assertEquals(25.99, $pen->price);
      $this->assertEquals(75, $pen->stock_quantity);
    });
  }

  /**
   * Test pen deletion workflow with confirmation
   */
  public function test_admin_can_delete_pen_with_confirmation(): void
  {
    // Arrange
    $pen = Pen::factory()->create([
      'name' => 'Pen To Delete',
      'type' => 'Ballpoint',
      'color' => 'Red'
    ]);

    $this->browse(function (Browser $browser) use ($pen) {
      $this->loginUser($browser);

      $browser->visit($this->frontendUrl . '/dashboard/pens')
        ->assertSee('Pen To Delete')
        ->click("@delete-pen-{$pen->id}")
        ->waitFor('.confirmation-modal', 5)
        ->assertSee('Are you sure you want to delete this pen?')
        ->press('Confirm Delete')
        ->waitFor('.success-message', 10)
        ->assertSee('Pen deleted successfully')
        ->assertDontSee('Pen To Delete');

      // Verify pen was deleted from database
      $this->assertDatabaseMissing('pens', [
        'id' => $pen->id
      ]);
    });
  }

  /**
   * Test form validation for pen creation
   */
  public function test_pen_form_validates_required_fields(): void
  {
    $this->browse(function (Browser $browser) {
      $this->loginUser($browser);

      $browser->visit($this->frontendUrl . '/dashboard/pens/create')
        ->press('Create Pen') // Submit empty form
        ->waitFor('.error-message', 5)
        ->assertSee('The name field is required')
        ->assertSee('The type field is required')
        ->assertSee('The color field is required')
        ->assertSee('The price field is required')
        ->assertSee('The stock quantity field is required');
    });
  }

  /**
   * Test price validation (must be positive number)
   */
  public function test_pen_form_validates_price_format(): void
  {
    $this->browse(function (Browser $browser) {
      $this->loginUser($browser);

      $browser->visit($this->frontendUrl . '/dashboard/pens/create')
        ->type('#name', 'Test Pen')
        ->select('#type', 'Ballpoint')
        ->select('#color', 'Black')
        ->type('#price', '-10.50') // Invalid negative price
        ->type('#stock_quantity', '50')
        ->press('Create Pen')
        ->waitFor('.error-message', 5)
        ->assertSee('The price must be a positive number');
    });
  }

  /**
   * Test stock quantity validation (must be non-negative integer)
   */
  public function test_pen_form_validates_stock_quantity(): void
  {
    $this->browse(function (Browser $browser) {
      $this->loginUser($browser);

      $browser->visit($this->frontendUrl . '/dashboard/pens/create')
        ->type('#name', 'Test Pen')
        ->select('#type', 'Ballpoint')
        ->select('#color', 'Black')
        ->type('#price', '15.99')
        ->type('#stock_quantity', '-5') // Invalid negative stock
        ->press('Create Pen')
        ->waitFor('.error-message', 5)
        ->assertSee('Stock quantity must be zero or greater');
    });
  }

  /**
   * Test pen list with pagination
   */
  public function test_pen_list_displays_with_pagination(): void
  {
    // Arrange - create 25 pens to test pagination
    Pen::factory()->count(25)->create();

    $this->browse(function (Browser $browser) {
      $this->loginUser($browser);

      $browser->visit($this->frontendUrl . '/dashboard/pens')
        ->assertSee('Pen Management')
        ->assertPresent('.pagination')
        ->assertSee('Showing 1 to 10 of 25')
        ->clickLink('2') // Go to page 2
        ->waitFor('.pen-list', 5)
        ->assertSee('Showing 11 to 20 of 25');
    });
  }

  /**
   * Test pen search functionality
   */
  public function test_admin_can_search_pens_by_name(): void
  {
    // Arrange
    Pen::factory()->create(['name' => 'Red Ballpoint Pen', 'color' => 'Red']);
    Pen::factory()->create(['name' => 'Blue Fountain Pen', 'color' => 'Blue']);
    Pen::factory()->create(['name' => 'Green Marker', 'color' => 'Green']);

    $this->browse(function (Browser $browser) {
      $this->loginUser($browser);

      $browser->visit($this->frontendUrl . '/dashboard/pens')
        ->type('#search', 'Blue')
        ->press('Search')
        ->waitFor('.pen-list', 5)
        ->assertSee('Blue Fountain Pen')
        ->assertDontSee('Red Ballpoint Pen')
        ->assertDontSee('Green Marker');
    });
  }

  /**
   * Test pen filtering by type
   */
  public function test_admin_can_filter_pens_by_type(): void
  {
    // Arrange
    Pen::factory()->create(['name' => 'Ballpoint 1', 'type' => 'Ballpoint']);
    Pen::factory()->create(['name' => 'Fountain 1', 'type' => 'Fountain']);
    Pen::factory()->create(['name' => 'Marker 1', 'type' => 'Marker']);

    $this->browse(function (Browser $browser) {
      $this->loginUser($browser);

      $browser->visit($this->frontendUrl . '/dashboard/pens')
        ->select('#type-filter', 'Fountain')
        ->waitFor('.pen-list', 5)
        ->assertSee('Fountain 1')
        ->assertDontSee('Ballpoint 1')
        ->assertDontSee('Marker 1');
    });
  }

  /**
   * Test low stock alert display
   */
  public function test_displays_low_stock_alerts(): void
  {
    // Arrange
    $lowStockPen = Pen::factory()->create([
      'name' => 'Low Stock Pen',
      'stock_quantity' => 2 // Below threshold
    ]);
    $normalStockPen = Pen::factory()->create([
      'name' => 'Normal Stock Pen',
      'stock_quantity' => 50
    ]);

    $this->browse(function (Browser $browser) use ($lowStockPen) {
      $this->loginUser($browser);

      $browser->visit($this->frontendUrl . '/dashboard/pens')
        ->assertSee('Low Stock Pen')
        ->assertPresent("@low-stock-alert-{$lowStockPen->id}")
        ->assertSeeIn("@low-stock-alert-{$lowStockPen->id}", 'Low Stock');
    });
  }

  /**
   * Test bulk operations - select multiple pens
   */
  public function test_admin_can_perform_bulk_operations(): void
  {
    // Arrange
    $pen1 = Pen::factory()->create(['name' => 'Pen 1']);
    $pen2 = Pen::factory()->create(['name' => 'Pen 2']);
    $pen3 = Pen::factory()->create(['name' => 'Pen 3']);

    $this->browse(function (Browser $browser) use ($pen1, $pen2) {
      $this->loginUser($browser);

      $browser->visit($this->frontendUrl . '/dashboard/pens')
        ->check("@select-pen-{$pen1->id}")
        ->check("@select-pen-{$pen2->id}")
        ->click('@bulk-actions-dropdown')
        ->clickLink('Delete Selected')
        ->waitFor('.confirmation-modal', 5)
        ->assertSee('Delete 2 selected pens?')
        ->press('Confirm Delete')
        ->waitFor('.success-message', 10)
        ->assertSee('2 pens deleted successfully')
        ->assertDontSee('Pen 1')
        ->assertDontSee('Pen 2')
        ->assertSee('Pen 3'); // Should still exist
    });
  }

  /**
   * Test responsive design on mobile devices
   */
  public function test_pen_management_works_on_mobile(): void
  {
    $this->browse(function (Browser $browser) {
      $browser->resize(375, 667); // iPhone viewport
      $this->loginUser($browser);

      $browser->visit($this->frontendUrl . '/dashboard/pens')
        ->assertSee('Pen Management')
        ->tap('@mobile-menu-toggle')
        ->assertSee('Add New Pen');
    });
  }

  /**
   * Test data export functionality
   */
  public function test_admin_can_export_pen_data(): void
  {
    // Arrange
    Pen::factory()->count(5)->create();

    $this->browse(function (Browser $browser) {
      $this->loginUser($browser);

      $browser->visit($this->frontendUrl . '/dashboard/pens')
        ->click('@export-button')
        ->waitFor('.export-modal', 5)
        ->select('#export-format', 'csv')
        ->press('Export')
        ->waitFor('.download-link', 10)
        ->assertSee('Download ready');
    });
  }

  /**
   * Test real-time inventory updates
   */
  public function test_inventory_updates_reflect_immediately(): void
  {
    // Arrange
    $pen = Pen::factory()->create([
      'name' => 'Test Pen',
      'stock_quantity' => 100
    ]);

    $this->browse(function (Browser $browser) use ($pen) {
      $this->loginUser($browser);

      $browser->visit($this->frontendUrl . '/dashboard/pens')
        ->assertSeeIn("@pen-row-{$pen->id}", '100')
        ->click("@quick-edit-{$pen->id}")
        ->clear('@stock-input')
        ->type('@stock-input', '85')
        ->press('Update')
        ->waitUntilMissing('.loading-spinner', 5)
        ->assertSeeIn("@pen-row-{$pen->id}", '85');

      // Verify database was updated
      $pen->refresh();
      $this->assertEquals(85, $pen->stock_quantity);
    });
  }

  /**
   * Helper method to login user
   */
  private function loginUser(Browser $browser): void
  {
    $browser->visit($this->frontendUrl . '/login')
      ->type('email', $this->user->email)
      ->type('password', 'password123')
      ->press('Log in')
      ->waitForLocation('/dashboard', 10);
  }
}
