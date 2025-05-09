'use client';

import { Button } from '@/components/Button';
import Input from '@/components/Input';
import InputError from '@/components/InputError';
import { Label } from '@/components/Label';
import Link from 'next/link';
import { useAuth } from '@/hooks/auth';
import { useState } from 'react';

// 型エイリアスを追加
type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
type FormEvent = React.FormEvent<HTMLFormElement>;

const Page = () => {
  const { register } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/dashboard',
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<{
    name?: string[];
    email?: string[];
    password?: string[];
    password_confirmation?: string[];
  }>({});

  const submitForm = (event: FormEvent) => {
    event.preventDefault();

    register({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
      setErrors,
    });
  };

  return (
    <form onSubmit={submitForm}>
      {/* Name */}
      <div>
        <Label htmlFor="name">Name</Label>

        <Input
          id="name"
          type="text"
          value={name}
          className="block mt-1 w-full"
          onChange={(event: InputChangeEvent) => setName(event.target.value)}
          required
          autoFocus
        />

        <InputError messages={errors.name} className="mt-2" />
      </div>

      {/* Email Address */}
      <div className="mt-4">
        <Label htmlFor="email">Email</Label>

        <Input
          id="email"
          type="email"
          value={email}
          className="block mt-1 w-full"
          onChange={(event: InputChangeEvent) => setEmail(event.target.value)}
          required
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
          autoComplete="new-password"
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

        <InputError messages={errors.password_confirmation} className="mt-2" />
      </div>

      <div className="flex items-center justify-end mt-4">
        <Link
          href="/login"
          className="underline text-sm text-gray-600 hover:text-gray-900"
        >
          Already registered?
        </Link>

        <Button className="ml-4">Register</Button>
      </div>
    </form>
  );
};

export default Page;
