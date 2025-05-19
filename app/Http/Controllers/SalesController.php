<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SalesController extends Controller
{
    public function topWeekly()
    {
        // 今週の売上トップ5商品を返すロジック
        return response()->json([]);
    }

    public function monthly()
    {
        // 月別売上推移を返すロジック
        return response()->json([]);
    }

    public function weekly()
    {
        // 週別売上推移を返すロジック
        return response()->json([]);
    }
}
