'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import Logo from '../shared/Logo';
import { useAuth } from '@/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

const provider = new GoogleAuthProvider();

export default function AuthForm() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, provider);
      router.push('/account');
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/account');
    } catch (error: any) {
      console.error('Error signing in with email:', error);
       toast({
        variant: 'destructive',
        title: 'Sign-in Failed',
        description: error.code === 'auth/invalid-credential' 
          ? 'Invalid email or password. Please try again.'
          : error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/account');
    } catch (error: any) {
      console.error('Error signing up with email:', error);
      toast({
        variant: 'destructive',
        title: 'Sign-up Failed',
        description: error.message || 'Could not create account.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="login" className="w-full max-w-sm">
      <Card>
        <CardHeader className="text-center">
          <Logo className="mb-4 justify-center" />
          <CardTitle className="text-2xl">Welcome to Amazon.in</CardTitle>
          <CardDescription>
            Sign in or create an account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleEmailSignUp} className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
           <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>
          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full"
            disabled={isLoading}
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
            Continue with Google
          </Button>
        </CardFooter>
      </Card>
    </Tabs>
  );
}