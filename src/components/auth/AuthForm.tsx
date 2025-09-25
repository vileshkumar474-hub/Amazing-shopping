'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '../shared/Logo';
import { useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const provider = new GoogleAuthProvider();

export default function AuthForm() {
  const router = useRouter();
  const auth = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push('/account');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      // Handle error, maybe show a toast
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <Logo className="mb-4 justify-center" />
        <CardTitle className="text-2xl">Welcome to ShopSphere</CardTitle>
        <CardDescription>
          Sign in or create an account to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleGoogleSignIn}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.417 9.99C34.553 6.486 29.605 4.5 24 4.5C13.522 4.5 4.933 12.062 4.933 22.5s8.589 18 19.067 18c9.835 0 17.64-6.363 17.64-18.257c0-1.258-.122-2.483-.34-3.66z"
            />
            <path
              fill="#FF3D00"
              d="M6.306 14.691L12.05 18.23C13.344 14.939 16.353 12.5 20.083 12.5c3.059 0 5.842 1.154 7.961 3.039L34.417 9.99C30.553 6.486 25.605 4.5 20 4.5C13.522 4.5 7.933 11.062 6.306 14.691z"
            />
            <path
              fill="#4CAF50"
              d="M20 40.5c5.605 0 10.553-3.486 13.417-8.99l-5.755-3.54c-1.293 3.301-4.302 5.53-8.082 5.53c-4.66 0-8.6-3.236-9.8-7.584l-5.96 3.49C7.933 34.938 13.522 40.5 20 40.5z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H20v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.417 9.99C34.553 6.486 29.605 4.5 24 4.5C13.522 4.5 4.933 12.062 4.933 22.5s8.589 18 19.067 18c9.835 0 17.64-6.363 17.64-18.257c0-1.258-.122-2.483-.34-3.66z"
            />
          </svg>
          Sign in with Google
        </Button>
      </CardContent>
    </Card>
  );
}
