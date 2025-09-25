import { getPersonalizedRecommendations } from '@/ai/flows/personalized-product-recommendations';
import ProductCarousel from '@/components/products/ProductCarousel';
import ProductGrid from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { getFeaturedProducts, getProductsByIds, products } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Product } from '@/lib/types';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

async function RecommendedProducts() {
  let recommendedProducts: Product[] = [];
  try {
    // In a real app, you'd get the userId and history from the user's session
    const recommendations = await getPersonalizedRecommendations({
      userId: 'user-123',
      browsingHistory: ['prod-1', 'prod-3'],
      pastPurchases: ['prod-5'],
    });
    recommendedProducts = getProductsByIds(recommendations.productIds);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    // Fallback to a default set of products if AI fails
    recommendedProducts = products.slice(4, 10);
  }

  return <ProductCarousel products={recommendedProducts} />;
}

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-1');
  const featuredProducts = getFeaturedProducts();

  return (
    <div className="flex flex-col">
      <section className="relative w-full overflow-hidden bg-primary/10">
        <div className="container mx-auto grid grid-cols-1 items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col items-start gap-6">
            <h1 className="text-4xl font-bold tracking-tighter text-primary-foreground md:text-5xl lg:text-6xl">
              The Great Indian Festival is Live!
            </h1>
            <p className="max-w-md text-lg text-primary-foreground/80">
              Unbeatable deals, endless choices. Your ultimate shopping
              adventure starts now at ShopSphere.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/products">
                  <ShoppingBag className="mr-2" />
                  Shop Now
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#featured">
                  Explore Deals
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 w-full md:h-full">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="rounded-lg object-cover shadow-2xl"
                data-ai-hint={heroImage.imageHint}
              />
            )}
          </div>
        </div>
      </section>

      <section id="featured" className="w-full py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tighter text-foreground md:text-4xl">
              Featured Products
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground md:text-lg">
              Handpicked for you. Discover our most popular items.
            </p>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      <section className="w-full bg-muted/50 py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tighter text-foreground md:text-4xl">
              Just For You
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground md:text-lg">
              Personalized recommendations based on your activity.
            </p>
          </div>
          <RecommendedProducts />
        </div>
      </section>
    </div>
  );
}
