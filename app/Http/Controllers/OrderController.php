<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Customer;
use App\Models\Pen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    $ordersQuery = Order::select(['id', 'pen_id', 'customer_id', 'num', 'shipping', 'orderday'])
      ->with(['customer:id,name', 'pen:id,name,price']);

    $orders = $ordersQuery->paginate(4);

    return response()->json([
      'data' => OrderResource::collection($orders),
      'meta' => [
        'current_page' => $orders->currentPage(),
        'per_page' => $orders->perPage(),
        'next_page_url' => $orders->nextPageUrl(),
        'prev_page_url' => $orders->previousPageUrl(),
      ],
    ]);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    $pens = Pen::all();
    $customers = Customer::all();
    return response()->json([
      'pens' => $pens,
      'customers' => $customers,
    ]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    $validated = $request->validate([
      'customer_id' => 'required|exists:customers,id',
      'pen_id' => 'required|exists:pens,id',
      'num' => 'required|integer|min:1',
    ]);

    $order = new Order();
    $order->customer_id = $validated['customer_id'];
    $order->pen_id = $validated['pen_id'];
    $order->num = $validated['num'];
    $order->orderday = now();
    $order->save();

    return response()->json(['message' => '注文を登録しました。']);
  }

  /**
   * Display the specified resource.
   */
  public function show(Order $order)
  {
    //
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit($id)
  {
    $order = Order::find($id);
    $pens = Pen::all();
    $customers = Customer::all();
    return response()->json([
      'data' => $order,
      'pens' => $pens,
      'customers' => $customers,
    ]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, $id)
  {
    $validated = $request->validate([
      'customer_id' => 'required|exists:customers,id',
      'pen_id' => 'required|exists:pens,id',
      'num' => 'required|integer|min:1',
    ]);

    $order = Order::find($id);
    $order->customer_id = $validated['customer_id'];
    $order->pen_id = $validated['pen_id'];
    $order->num = $validated['num'];
    $order->save();

    return response()->json(['message' => '注文を更新しました。']);
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Order $order)
  {
    //
  }

  public function delete($id)
  {
    $order = Order::find($id);
    $order->delete();

    return response()->json(['message' => '注文を削除しました。']);
  }

  public function ship($id)
  {
    $order = Order::find($id);
    $order->shipping = true;
    $order->save();

    return response()->json(['message' => '出荷処理が完了しました。']);
  }
}
