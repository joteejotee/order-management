// src/components/Input.tsx

import React, { forwardRef, InputHTMLAttributes } from 'react'

// 型定義を追加
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => (
    <input
      {...props}
      className={`border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${className}`}
      ref={ref}
    />
  ),
)

// コンポーネントをエクスポート
export default Input
