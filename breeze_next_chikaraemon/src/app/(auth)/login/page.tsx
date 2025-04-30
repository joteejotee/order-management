import LoginForm from './LoginForm';
import { UserCircle } from 'lucide-react';

export default function LoginPage() {
  return (
    <>
      <div className="text-center mb-6">
        <UserCircle
          className="w-16 h-16 text-gray-700 mx-auto mb-6"
          strokeWidth={1.5}
        />
        <h1 className="text-3xl font-bold">Login</h1>
      </div>
      <LoginForm />
    </>
  );
}
