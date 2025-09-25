'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Tag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartProvider';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart();
  const { toast } = useToast();
  const placeholder = PlaceHolderImages.find((p) => p.id === product.imageId);

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity: 1 } });
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="flex h-full w-full transform flex-col overflow-hidden rounded-lg bg-card shadow-sm transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <CardHeader className="relative p-0">
        <Link href={`/products/${product.id}`} className="block">
          <div className="relative aspect-[3/4] w-full">
            {placeholder && (
              <Image
                src={placeholder.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                data-ai-hint={placeholder.imageHint}
              />
            )}
          </div>
        </Link>
        {product.originalPrice && (
          <Badge className="absolute top-2 left-2 border-2 border-background" variant="destructive">
            <Tag className="mr-1 h-3 w-3" /> SALE
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.id}`} className="flex-1">
          <CardTitle className="text-lg font-semibold leading-tight hover:text-primary">
            {product.name}
          </CardTitle>
          <CardDescription className="mt-1 text-sm text-muted-foreground">
            {product.category}
          </CardDescription>
        </Link>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <p className="text-xl font-bold text-primary">₹{product.price.toLocaleString()}</p>
            {product.originalPrice && (
                <p className="text-sm font-medium text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString()}
                </p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-muted-foreground">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
