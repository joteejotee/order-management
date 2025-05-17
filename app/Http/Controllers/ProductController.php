<?php

namespace App\Http\Controllers;

use App\Models\Pen;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function total()
    {
        return response()->json(['total' => Pen::count()]);
    }

    public function outOfStock()
    {
        return Pen::where('stock', 0)->get();
    }

    public function lowStock()
    {
        return Pen::where('stock', '>', 0)->where('stock', '<=', 5)->get();
    }
}
