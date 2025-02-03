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
      'customer' => CustomerResource::make($this->customer),
      'pen' => PenResource::make($this->pen),
      'num' => $this->num,
      'orderday' => $this->orderday_formatted,
      'shipping' => $this->shipping,
    ];
  }
}
