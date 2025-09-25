'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getOrderById } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Circle, Package, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect, Suspense } from 'react';
import type { Order } from '@/lib/types';

type OrderPageProps = {
  params: { id: string };
};

const statusSteps = ['Processing', 'Shipped', 'Delivered'];

function OrderPageComponent({ params: paramsPromise }: OrderPageProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [params, setParams] = useState<OrderPageProps['params'] | null>(null);

  useEffect(() => {
    Promise.resolve(paramsPromise).then(setParams);
  }, [paramsPromise]);

  useEffect(() => {
    if (params) {
      const foundOrder = getOrderById(params.id);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        notFound();
      }
    }
  }, [params]);

  if (!order) {
    return <div>Loading...</div>;
  }

  const orderIdSuffix = order.id.startsWith('order_') ? order.id.substring(6) : order.id.split('-')[1] || order.id;
  const currentStatusIndex = statusSteps.indexOf(order.status);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold">Order Details</h1>
        <p className="mb-8 text-muted-foreground">Order #{orderIdSuffix} &bull; Placed on {new Date(order.date).toLocaleDateString()}</p>
        
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative flex justify-between">
                    <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-muted"></div>
                    <div className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-primary transition-all duration-500" style={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}></div>
                    {statusSteps.map((status, index) => (
                        <div key={status} className="relative z-10 flex flex-col items-center">
                            <div className={cn("flex h-10 w-10 items-center justify-center rounded-full border-2", 
                                index <= currentStatusIndex ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground bg-background text-muted-foreground'
                            )}>
                                {index <= currentStatusIndex ? <CheckCircle /> : <Circle />}
                            </div>
                            <p className="mt-2 text-sm font-medium">{status}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card>
                <CardHeader><CardTitle>Items Ordered</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {order.items.map(item => {
                        const placeholder = PlaceHolderImages.find(p => p.id === item.imageId);
                        return (
                            <div key={item.id} className="flex items-center gap-4">
                                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                                    {placeholder && <Image src={placeholder.imageUrl} alt={item.name} fill className="object-cover" />}
                                </div>
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                                <p className="ml-auto font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-between"><span>Subtotal</span><span>₹{(order.total - 50).toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Shipping</span><span>₹50.00</span></div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{order.total.toLocaleString()}</span></div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

export default function OrderPage(props: OrderPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderPageComponent {...props} />
    </Suspense>
  );
}
