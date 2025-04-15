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
        ];
    }

    public function attributes()
    {
        return [
            'status' => 'ステータス',
            'shipping' => '出荷状態',
        ];
    }

    public function messages()
    {
        return [
            'status.required' => ':attributeを選択してください。',
            'status.in' => ':attributeの値が不正です。',
            'shipping.required' => ':attributeを指定してください。',
            'shipping.boolean' => ':attributeの形式が不正です。',
        ];
    }
}

