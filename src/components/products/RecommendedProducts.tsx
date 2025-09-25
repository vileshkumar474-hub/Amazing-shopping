import { getPersonalizedRecommendations } from '@/ai/flows/personalized-product-recommendations';
import { getProductsByIds, getFeaturedProducts } from '@/lib/data';
import type { Product } from '@/lib/types';
import ProductCarousel from './ProductCarousel';

export default async function RecommendedProducts() {
  let recommendedProducts: Product[] = [];
  try {
    // In a real app, you'd get the userId and history from the user's session
    const recommendations = await getPersonalizedRecommendations({
      userId: 'user-123',
      browsingHistory: ['prod-1', 'prod-3'],
      pastPurchases: ['prod-5'],
    });
    if (recommendations && recommendations.productIds) {
      recommendedProducts = getProductsByIds(recommendations.productIds);
    }
  } catch (error) {
    console.error('Error fetching recommendations, falling back to featured products:', error);
    // Fallback to featured products if AI fails
    recommendedProducts = getFeaturedProducts();
  }

  // If recommendations are empty for any reason, use featured products
  if (recommendedProducts.length === 0) {
    recommendedProducts = getFeaturedProducts();
  }

  return <ProductCarousel products={recommendedProducts} />;
}
