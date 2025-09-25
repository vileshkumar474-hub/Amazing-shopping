'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartProvider';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Script from 'next/script';
import { useUser } from '@/firebase';

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

export default function CheckoutPage() {
  const { state, dispatch } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const subtotal = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + (subtotal > 0 ? 50 : 0);

  const makePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!RAZORPAY_KEY_ID) {
      toast({
        variant: 'destructive',
        title: 'Configuration Error',
        description: 'Razorpay Key ID is not configured.',
      });
      return;
    }

    const res = await fetch('/api/razorpay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: total }),
    });

    if (!res.ok) {
      toast({
        variant: 'destructive',
        title: 'Error creating order',
        description: 'There was a problem with the payment provider.',
      });
      return;
    }

    const order = await res.json();

    const options = {
      key: RAZORPAY_KEY_ID,
      name: 'Amazon.in',
      currency: order.currency,
      amount: order.amount,
      order_id: order.id,
      description: 'Your Amazon.in Purchase',
      handler: function (response: any) {
        toast({
          title: 'Payment Successful!',
          description: `Payment ID: ${response.razorpay_payment_id}`,
        });
        dispatch({ type: 'CLEAR_CART' });
        router.push(`/orders/${order.id}`);
      },
      prefill: {
        name: user?.displayName || 'Amazon User',
        email: user?.email || '',
      },
      theme: {
        color: '#12544F' // Corresponds to hsl(180, 100%, 25%)
      }
    };
    
    // @ts-ignore
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-center text-4xl font-bold">Checkout</h1>
        <form onSubmit={makePayment} className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Anjali" defaultValue={user?.displayName?.split(' ')[0] ?? ''} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Sharma" defaultValue={user?.displayName?.split(' ')[1] ?? ''} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123, MG Road" required />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Mumbai" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select>
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MH">Maharashtra</SelectItem>
                        <SelectItem value="DL">Delhi</SelectItem>
                        <SelectItem value="KA">Karnataka</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">PIN Code</Label>
                    <Input id="zip" placeholder="400001" required />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="razorpay" className="space-y-4">
                  <Label className="flex items-center space-x-3 rounded-md border p-4">
                    <RadioGroupItem value="razorpay" id="razorpay" />
                    <div className="flex flex-col">
                      <span>Razorpay</span>
                      <span className="text-sm text-muted-foreground">Pay with Card, UPI, etc.</span>
                    </div>
                  </Label>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Your Order</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {state.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{subtotal > 0 ? '50.00' : '0.00'}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
            <Button type="submit" size="lg" className="mt-6 w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={state.items.length === 0}>
              Place Order
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
