'use client';

import { Button } from '@/components/Button';
import Input from '@/components/Input';
import InputError from '@/components/InputError';
import { Label } from '@/components/Label';
import { useAuth } from '@/hooks/auth';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import AuthSessionStatus from '@/app/(auth)/AuthSessionStatus';

// 型エイリアスを追加
type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
type FormEvent = React.FormEvent<HTMLFormElement>;

const PasswordReset = () => {
  const searchParams = useSearchParams();
  const params = useParams();

  const { resetPassword } = useAuth({ middleware: 'guest' });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<{
    email?: string[];
    password?: string[];
    password_confirmation?: string[];
  }>({});
  const [status, setStatus] = useState<string | null>(null);

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    resetPassword({
      email,
      password,
      password_confirmation: passwordConfirmation,
      token: params.token as string,
      setErrors,
      setStatus,
    });
  };

  useEffect(() => {
    setEmail(searchParams.get('email') || '');
  }, [searchParams]);

  return (
    <>
      {/* Session Status */}
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
            onChange={(event: InputChangeEvent) => setEmail(event.target.value)}
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
          />

          <InputError messages={errors.password} className="mt-2" />
        </div>

        {/* Confirm Password */}
        <div className="mt-4">
          <Label htmlFor="passwordConfirmation">Confirm Password</Label>

          <Input
            id="passwordConfirmation"
            type="password"
            value={passwordConfirmation}
            className="block mt-1 w-full"
            onChange={(event: InputChangeEvent) =>
              setPasswordConfirmation(event.target.value)
            }
            required
          />

          <InputError
            messages={errors.password_confirmation}
            className="mt-2"
          />
        </div>

        <div className="flex items-center justify-end mt-4">
          <Button>Reset Password</Button>
        </div>
      </form>
    </>
  );
};

export default PasswordReset;
