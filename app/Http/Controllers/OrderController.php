<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\OrderResource;
use App\Http\Requests\OrderStoreRequest;

class OrderController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    $orders = Order::paginate(4);
    $ordersQuery = Order::orderBy('id', 'desc');
    $ordersPaginator = $ordersQuery->paginate(4); // ページネーション
    $orders = OrderResource::collection($ordersPaginator->items());
    return response()->json([
      'data' => $orders,
      'meta' => [
        'current_page' => $ordersPaginator->currentPage(),
        'per_page' => $ordersPaginator->perPage(),
        'total' => $ordersPaginator->total(),
        'next_page_url' => $ordersPaginator->nextPageUrl(),
        'prev_page_url' => $ordersPaginator->previousPageUrl(),
      ],
    ], 200);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    //
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(OrderStoreRequest $request)
  {
    $order = new Order();
    $order->pen_id = $request->pen_id;
    $order->customer_id = $request->customer_id;
    $order->num = $request->num;
    $order->orderday = date('Y-m-d H:i:s');
    $order->save();
    return response()->json([
        'data' => $order
    ], 201);
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
  public function edit(Order $order)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateOrderRequest $request, Order $order)
  {
    //
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Order $order)
  {
    //
  }
}
