<?php

namespace Tests\Unit;

use App\Models\Pen;
use PHPUnit\Framework\TestCase;

class PenModelTest extends TestCase
{
  public function test_pen_attributes_are_fillable(): void
  {
    $pen = new Pen();

    $expected = ['name', 'price', 'stock'];
    $this->assertEquals($expected, $pen->getFillable());
  }

  public function test_pen_has_correct_table_name(): void
  {
    $pen = new Pen();
    $this->assertEquals('pens', $pen->getTable());
  }

  public function test_pen_has_timestamps(): void
  {
    $pen = new Pen();
    $this->assertTrue($pen->usesTimestamps());
  }
}
