'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { Star, Minus, Plus, ShoppingCart, CreditCard, Tag } from 'lucide-react';

import { getProductById } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartProvider';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';

type ProductPageProps = {
  params: { id: string };
};

function ProductPageComponent({ params: paramsPromise }: ProductPageProps) {
  const { dispatch } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [product, setProduct] = useState<Product | null>(null);
  const [params, setParams] = useState<ProductPageProps['params'] | null>(null);

  useEffect(() => {
    Promise.resolve(paramsPromise).then(setParams);
  }, [paramsPromise]);

  useEffect(() => {
    if (params) {
      const foundProduct = getProductById(params.id);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        notFound();
      }
    }
  }, [params]);

  const productImages = product?.images ? PlaceHolderImages.filter(p => product.images?.includes(p.id)) : [];
  const initialImage = product ? PlaceHolderImages.find(p => p.id === product.imageId) : undefined;
  const [mainImage, setMainImage] = useState(productImages[0] || initialImage);
  
  useEffect(() => {
      const initialImg = product ? (PlaceHolderImages.filter(p => product.images?.includes(p.id))[0] || PlaceHolderImages.find(p => p.id === product.imageId)) : undefined;
      setMainImage(initialImg);
  }, [product]);


  if (!product) {
    return <div>Loading...</div>;
  }
  
  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        variant: 'destructive',
        title: 'Please select a size',
        description: 'You must select a size before adding to cart.',
      });
      return;
    }
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
    toast({
      title: 'Added to Cart',
      description: `${quantity} x ${product.name} added to your cart.`,
    });
  };

  const handleBuyNow = () => {
     if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        variant: 'destructive',
        title: 'Please select a size',
        description: 'You must select a size before proceeding to checkout.',
      });
      return;
    }
    dispatch({ type: 'CLEAR_CART' });
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
    router.push('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg">
            {mainImage && (
              <Image
                src={mainImage.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                data-ai-hint={mainImage.imageHint}
              />
            )}
             {product.originalPrice && (
              <Badge className="absolute top-4 left-4 border-2 border-background text-lg" variant="destructive">
                <Tag className="mr-2 h-5 w-5" /> SALE
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-6 gap-2">
            {productImages.map((img) => (
              <div
                key={img.id}
                className={`relative aspect-square cursor-pointer rounded-md border-2 ${mainImage?.id === img.id ? 'border-primary' : 'border-transparent'}`}
                onClick={() => setMainImage(img)}
              >
                <Image
                  src={img.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="font-semibold text-primary">{product.category}</p>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{product.name}</h1>
            {product.brand && <p className="text-lg text-muted-foreground">by {product.brand}</p>}
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

           <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-primary">₹{product.price.toLocaleString()}</p>
            {product.originalPrice && (
              <p className="text-xl font-medium text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString()}
              </p>
            )}
          </div>

          <p className="text-base text-muted-foreground">{product.description}</p>

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          )}
          
          <Separator />
          
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-4">
              <p className="font-medium">Size:</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <Badge 
                    key={size}
                    variant={selectedSize === size ? 'default' : 'outline'}
                    onClick={() => setSelectedSize(size)}
                    className="cursor-pointer px-3 py-1 text-base"
                  >
                    {size}
                  </Badge>
                ))}
              </div>
            </div>
          )}


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
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleAddToCart} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <ShoppingCart className="mr-2" />
              Add to Cart
            </Button>
             <Button onClick={handleBuyNow} variant="outline" size="lg">
              <CreditCard className="mr-2" />
              Buy Now
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ProductPage(props: ProductPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductPageComponent {...props} />
    </Suspense>
  );
}
