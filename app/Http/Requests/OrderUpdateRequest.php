<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrderUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', 'required', 'string', Rule::in(['pending', 'shipped'])],
            'shipping' => ['sometimes', 'required', 'boolean'],
            'num' => ['sometimes', 'required', 'integer', 'min:1', 'max:20'],
            'pen_id' => ['sometimes', 'required', 'integer', 'exists:pens,id'],
            'customer_id' => ['sometimes', 'required', 'integer', 'exists:customers,id'],
        ];
    }

    public function attributes()
    {
        return [
            'status' => 'ステータス',
            'shipping' => '出荷状態',
            'num' => '数量',
            'pen_id' => '商品',
            'customer_id' => '顧客',
        ];
    }

    public function messages()
    {
        return [
            'status.required' => ':attributeを選択してください。',
            'status.in' => ':attributeの値が不正です。',
            'shipping.required' => ':attributeを指定してください。',
            'shipping.boolean' => ':attributeの形式が不正です。',
            'num.required' => ':attributeを入力してください。',
            'num.integer' => ':attributeは整数で入力してください。',
            'num.min' => ':attributeは1以上で入力してください。',
            'num.max' => ':attributeは20以下で入力してください。',
            'pen_id.required' => ':attributeを選択してください。',
            'pen_id.integer' => ':attributeは整数で入力してください。',
            'pen_id.exists' => '選択された:attributeは存在しません。',
            'customer_id.required' => ':attributeを選択してください。',
            'customer_id.integer' => ':attributeは整数で入力してください。',
            'customer_id.exists' => '選択された:attributeは存在しません。',
        ];
    }
}

