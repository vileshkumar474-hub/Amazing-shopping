'use client';

import Link from 'next/link';
import { orders } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserIcon, LogOut } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function AccountPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  if (isUserLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-center text-4xl font-bold">My Account</h1>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <Skeleton className="mx-auto h-24 w-24 rounded-full" />
                <Skeleton className="mt-4 h-6 w-3/4 mx-auto" />
                <Skeleton className="mt-2 h-4 w-full mx-auto" />
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>A summary of your most recent orders.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="w-1/2 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                      <div className="w-1/4 space-y-2 text-right">
                        <Skeleton className="h-4 w-full ml-auto" />
                        <Skeleton className="h-4 w-1/2 ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    // This should ideally not happen if you have proper route protection
    // For now, redirect to login
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-4xl font-bold">My Account</h1>
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6 text-center">
              <Avatar className="mx-auto h-24 w-24">
                <AvatarImage src={user.photoURL ?? ''} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <UserIcon className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold">{user.displayName}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Button variant="ghost" className="mt-4 w-full" disabled>
                Edit Profile
              </Button>
               <Button variant="destructive" className="mt-2 w-full" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>A summary of your most recent orders.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.slice(0, 3).map((order, index) => (
                    <div key={order.id}>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">Order #{order.id.split('-')[1]}</p>
                                <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">₹{order.total.toLocaleString()}</p>
                                <Link href={`/orders/${order.id}`} className="text-sm text-primary hover:underline">View Details</Link>
                            </div>
                        </div>
                        {index < orders.slice(0, 3).length -1 && <Separator className="mt-4"/>}
                    </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
                <Button asChild variant="outline" className="w-full">
                    <Link href="/orders">View All Orders</Link>
                </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
