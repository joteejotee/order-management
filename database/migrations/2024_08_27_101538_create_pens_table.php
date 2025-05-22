<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create(
      'pens',
      function (Blueprint $table) {
        $table->id();
        $table->string('name')->charset('utf8mb4')->collation('utf8mb4_unicode_ci');
        $table->bigInteger('price');
        $table->integer('stock')->default(0);
        $table->timestamps();
      },
      ['charset' => 'utf8mb4', 'collation' => 'utf8mb4_unicode_ci']
    );
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('pens');
  }
};
