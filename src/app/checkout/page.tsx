'use client';

import { useState } from 'react';
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
import { useUser } from '@/firebase';
import { orders } from '@/lib/data';
import shortid from 'shortid';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function CheckoutPage() {
  const { state, dispatch } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const subtotal = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + (subtotal > 0 ? 50 : 0);

  const handlePlaceOrder = async () => {
    const upiId = '9711837666-2@axl';
    const payeeName = 'Amazon.in';
    const transactionNote = `Payment for your order`;
    const orderId = `order_${shortid.generate()}`;

    // In a real app, you would save the pending order to your database here.
    // For this demo, we'll optimistically create the order in our local data.
    orders.push({
      id: orderId,
      date: new Date().toISOString(),
      total: total,
      status: 'Processing',
      items: state.items,
    });
    
    dispatch({ type: 'CLEAR_CART' });
    
    toast({
      title: 'Redirecting to UPI app',
      description: 'Please complete the payment in your UPI app to confirm the order.',
    });

    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      payeeName
    )}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent(
      transactionNote
    )}&tr=${orderId}`;

    // Redirect to UPI app
    window.location.href = upiUrl;

    // A small delay to allow the UPI app to open before redirecting to the order page.
    // In a real app, you'd have a webhook or a "check status" button to confirm payment.
    setTimeout(() => {
        router.push(`/orders/${orderId}`);
    }, 2000);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-center text-4xl font-bold">Checkout</h1>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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
                <RadioGroup defaultValue="upi" className="space-y-4">
                  <Label className="flex items-center space-x-3 rounded-md border p-4">
                    <RadioGroupItem value="upi" id="upi" />
                    <div className="flex flex-col">
                      <span>UPI (Direct Payment)</span>
                      <span className="text-sm text-muted-foreground">Pay with any UPI app.</span>
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="lg" className="mt-6 w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={state.items.length === 0}>
                  Place Order
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Your Order</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be redirected to your UPI app to complete the payment of ₹{total.toLocaleString()}. The cart will be cleared.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handlePlaceOrder}>
                    Confirm & Pay
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </>
  );
}
