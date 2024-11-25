'use client';

import { useAuth } from '@/hooks/auth';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AuthSessionStatus from '@/app/(auth)/AuthSessionStatus';

// バリデーションスキーマ
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスは必須です')
    .email('正しいメールアドレスを入力してください'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上である必要があります')
    .regex(/^[a-zA-Z0-9]+$/, '半角英数字のみ使用できます')
    .regex(/[A-Z]/, '大文字を1文字以上含める必要があります')
    .regex(/[0-9]/, '数字を1文字以上含める必要があります'),
  remember: z.boolean().default(false),
});

const Login = () => {
  const { login } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/dashboard',
  });

  const [status, setStatus] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    email?: string[];
    password?: string[];
  }>({});

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    await login({
      email: values.email,
      password: values.password,
      remember: values.remember,
      setErrors,
      setStatus,
    });
  };

  return (
    <>
      <AuthSessionStatus className="mb-4" status={status} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>メールアドレス</FormLabel>
                <FormControl>
                  <Input placeholder="mail@example.com" {...field} />
                </FormControl>
                <FormMessage />
                {errors.email && (
                  <span className="text-sm text-red-600">
                    {errors.email.join(', ')}
                  </span>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>パスワード</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
                {errors.password && (
                  <span className="text-sm text-red-600">
                    {errors.password.join(', ')}
                  </span>
                )}
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            ログイン
          </Button>
        </form>
      </Form>
    </>
  );
};

export default Login;
