import Link from 'next/link';
import { orders } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-4xl font-bold">My Orders</h1>
      <div className="mx-auto max-w-4xl space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Order #{order.id.split('-')[1]}</CardTitle>
                <CardDescription>Date: {new Date(order.date).toLocaleDateString()}</CardDescription>
              </div>
              <Badge
                className={cn(
                  order.status === 'Delivered' && 'bg-green-600',
                  order.status === 'Shipped' && 'bg-blue-600',
                  order.status === 'Processing' && 'bg-yellow-500',
                  order.status === 'Cancelled' && 'bg-red-600',
                  'text-white'
                )}
              >
                {order.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <p>Total: <span className="font-semibold">₹{order.total.toLocaleString()}</span></p>
              <p className="text-sm text-muted-foreground">{order.items.length} item(s)</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="ml-auto">
                <Link href={`/orders/${order.id}`}>
                  Track Order <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
