<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderStoreRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    return true;
  }
  public function rules(): array
  {
    return [
      'customer_id' => 'required|integer',
      'pen_id' => 'required|integer',
      'num' => 'required|integer|max:20|min:1',
    ];
  }
  public function attributes()
  {
    return [
      'customer_id' => '顧客',
      'pen_id' => 'ペン',
      'num' => '注文数',
    ];
  }
  public function messages()
  {
    return [
      'customer_id.required' => ':attributeを入力してください。',
      'pen_id.required' => ':attributeを入力してください。',
      'num.required' => ':attributeを入力してください。',
      'customer_id.integer' => ':attributeは数値で入力してください。',
      'pen_id.integer' => ':attributeは数値で入力してください。',
      'num.integer' => ':attributeは数値で入力してください。',
      'num.min' => ':attributeは1以上としてください。',
      'num.max' => ':attributeは20以下としてください。',
    ];
  }
}
