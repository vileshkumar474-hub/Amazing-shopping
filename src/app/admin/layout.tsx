'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';

const ADMIN_EMAIL = 'amitsingh125890@gmail.com';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      // If loading is finished and there's no user, redirect to login.
      router.push('/login');
    } else if (!isUserLoading && user && user.email !== ADMIN_EMAIL) {
      // If the user is not the admin, redirect them away.
      // You might want to redirect to a specific 'unauthorized' page
      // or the homepage.
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  // While checking, show a loading state.
  if (isUserLoading || !user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If the user is the admin, render the children (the admin page).
  return <>{children}</>;
}
