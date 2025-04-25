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
import { Eye, EyeOff, Check, UserCircle } from 'lucide-react';
import { useOptimizedAuth } from '@/hooks';

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
    .regex(/[a-z]/, '小文字を1文字以上含める必要があります')
    .regex(/[0-9]/, '数字を1文字以上含める必要があります'),
  remember: z.boolean().default(false),
});

const Login = () => {
  const { login } = useOptimizedAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/dashboard',
  });

  const [status, setStatus] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
    mode: 'onChange',
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await login({
        email: values.email,
        password: values.password,
      });
    } catch (error) {
      setStatus(
        '認証に失敗しました。メールアドレスとパスワードを確認してください。',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthSessionStatus className="mb-4" status={status} />
      <div className="text-center mb-6">
        <UserCircle
          className="w-16 h-16 text-gray-700 mx-auto mb-6"
          strokeWidth={1.5}
        />
        <h1 className="text-3xl font-bold">Login</h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 text-lg"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="relative mb-2 space-y-0">
                <FormLabel className="flex items-center text-lg">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    className="h-12 !text-lg placeholder:text-lg pt-1"
                    placeholder="mail@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-base mt-1" />
                {!form.formState.errors.email && field.value && (
                  <div className="absolute right-[-30px] top-[70%] transform -translate-y-1/2">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative space-y-0">
                <FormLabel className="flex items-center text-lg">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="h-12 !text-lg pt-1"
                      type={showPassword ? 'text' : 'password'}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-base mt-1" />
                {!form.formState.errors.password && field.value && (
                  <div className="absolute right-[-30px] top-[70%] transform -translate-y-1/2">
                    <Check className="h-6 w-6 text-green-500" />
                  </div>
                )}
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full text-lg h-12"
            disabled={isLoading}
          >
            {isLoading ? 'ログイン中...' : 'Login'}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default Login;
