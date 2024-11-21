'use client'

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AuthSessionStatus from '@/app/(auth)/AuthSessionStatus'

// 型エイリアスを追加
type InputChangeEvent = React.ChangeEvent<HTMLInputElement>
type FormEvent = React.FormEvent<HTMLFormElement>

const Login = () => {
  const router = useRouter()
  const searchParams = useSearchParams() // クエリパラメータを取得

  const { login } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/dashboard',
  })

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [shouldRemember, setShouldRemember] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string[]
    password?: string[]
  }>({})
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    const reset = searchParams.get('reset') // 'reset' パラメータを取得
    if (reset && Object.keys(errors).length === 0) {
      // 修正: errors.length → Object.keys(errors).length
      setStatus(atob(reset))
    } else {
      setStatus(null)
    }
  }, [searchParams, errors])

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    login({
      email,
      password,
      remember: shouldRemember,
      setErrors,
      setStatus,
    })
  }

  // 型エイリアスを使用
  const handleInputChange = (event: InputChangeEvent) => {
    setEmail(event.target.value)
  }

  return (
    <>
      <AuthSessionStatus className="mb-4" status={status || ''} />
      <form onSubmit={submitForm}>
        {/* Email Address */}
        <div>
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            type="email"
            value={email}
            className="block mt-1 w-full"
            onChange={handleInputChange}
            required
            autoFocus
          />

          <InputError messages={errors.email} className="mt-2" />
        </div>

        {/* Password */}
        <div className="mt-4">
          <Label htmlFor="password">Password</Label>

          <Input
            id="password"
            type="password"
            value={password}
            className="block mt-1 w-full"
            onChange={(event: InputChangeEvent) =>
              setPassword(event.target.value)
            }
            required
            autoComplete="current-password"
          />

          <InputError messages={errors.password} className="mt-2" />
        </div>

        {/* Remember Me */}
        <div className="block mt-4">
          <label htmlFor="remember_me" className="inline-flex items-center">
            <input
              id="remember_me"
              type="checkbox"
              name="remember"
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setShouldRemember(event.target.checked)
              }
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
        </div>

        <div className="flex items-center justify-end mt-4">
          <Link
            href="/forgot-password"
            className="underline text-sm text-gray-600 hover:text-gray-900"
          >
            Forgot your password?
          </Link>

          <Button className="ml-3">Login</Button>
        </div>
      </form>
    </>
  )
}

export default Login
