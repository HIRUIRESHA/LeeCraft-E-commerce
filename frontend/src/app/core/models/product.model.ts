export type ProductSize = 'Small' | 'Medium' | 'Large';

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image?: string;
  description: string;
  inStock: boolean;
  material: string;
  size: ProductSize;
  shape: string;
  color: string;
  rating: number;
  reviewCount: number;
}
