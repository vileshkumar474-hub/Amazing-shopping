
import ProductGrid from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { getFeaturedProducts } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import RecommendedProducts from '@/components/products/RecommendedProducts';
import { Suspense } from 'react';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-1');
  const featuredProducts = getFeaturedProducts();
  const sponsoredImage = PlaceHolderImages.find((img) => img.id === 'prod-14');

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
              adventure starts now at Amazon.in.
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

      <section className="w-full bg-secondary/20 py-12 md:py-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 items-center gap-8 rounded-lg bg-card p-8 shadow-md md:grid-cols-2">
            <div className="relative h-80 w-full">
              {sponsoredImage && (
                <Image
                  src={sponsoredImage.imageUrl}
                  alt="Bra Set For Women Underwear"
                  fill
                  className="rounded-lg object-cover"
                  data-ai-hint={sponsoredImage.imageHint}
                />
              )}
            </div>
            <div className="flex flex-col items-start gap-4">
              <p className="text-sm font-semibold text-muted-foreground">
                Sponsored
              </p>
              <h3 className="text-3xl font-bold tracking-tight">
                Bra Set For Women Underwear
              </h3>
              <p className="text-lg text-muted-foreground">
                Lowest prices on top brands.
              </p>
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <a
                  href="https://www.amazon.in/lingerie-sets/b?ie=UTF8&node=1968480031"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop on Amazon.in <ArrowRight className="ml-2" />
                </a>
              </Button>
            </div>
          </div>
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
          <Suspense fallback={<p className="text-center">Loading recommendations...</p>}>
            <RecommendedProducts />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
