'use client';

import { useState } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star, Minus, Plus, ShoppingCart } from 'lucide-react';

import { getProductById } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartProvider';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

type ProductPageProps = {
  params: { id: string };
};

export default function ProductPage({ params }: ProductPageProps) {
  const { dispatch } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  const placeholder = PlaceHolderImages.find((p) => p.id === product.imageId);

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
    toast({
      title: 'Added to Cart',
      description: `${quantity} x ${product.name} added to your cart.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-16">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg">
          {placeholder && (
            <Image
              src={placeholder.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              data-ai-hint={placeholder.imageHint}
            />
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="font-semibold text-primary">{product.category}</p>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{product.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          <p className="text-3xl font-bold text-primary">₹{product.price.toLocaleString()}</p>

          <p className="text-base text-muted-foreground">{product.description}</p>
          
          <Separator />

          <div className="flex items-center gap-4">
            <p className="font-medium">Quantity:</p>
            <div className="flex items-center rounded-md border">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button onClick={handleAddToCart} size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
            <ShoppingCart className="mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
