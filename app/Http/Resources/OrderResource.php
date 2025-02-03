<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    return [
      'id' => $this->id,
      'num' => $this->num,
      'orderday' => $this->orderday_formatted,
      'customer' => CustomerResource::make($this->customer),
      'pen' => PenResource::make($this->pen),
      'shipping' => $this->shipping,
    ];
  }
}
