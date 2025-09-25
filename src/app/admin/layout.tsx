'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// This is the email of the designated administrator.
const ADMIN_EMAIL = 'amitsingh125890@gmail.com';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (isUserLoading) {
      // Still checking for the user, so we wait.
      return;
    }

    if (!user) {
      // If loading is finished and there's no user, redirect to login.
      router.push('/login');
      return;
    }

    // Check if the logged-in user is the administrator.
    if (user.email !== ADMIN_EMAIL) {
      // If not, show an access denied message and redirect them.
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'You do not have permission to access the admin panel.',
      });
      router.push('/');
    }
  }, [user, isUserLoading, router, toast]);

  // While checking, show a loading state.
  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If the user is not the admin, show an "Access Denied" message while redirecting.
  if (user.email !== ADMIN_EMAIL) {
    return (
       <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <ShieldAlert className="h-12 w-12 text-destructive" />
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    )
  }

  // If the user is the admin, render the admin page content.
  return <>{children}</>;
}
