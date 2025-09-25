export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageId: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  images?: string[]; // For multiple images
  sizes?: string[]; // Available sizes
  weight?: number; // in grams
  manufacturer?: string;
  brand?: string;
  tags?: string[];
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageId: string;
};

export type Order = {
  id: string;
  date: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: CartItem[];
};

export type User = {
  id: string;
  name: string;
  email: string;
};
