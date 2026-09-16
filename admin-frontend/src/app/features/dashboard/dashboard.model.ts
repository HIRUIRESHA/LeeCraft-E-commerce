export type ProductSize = 'Small' | 'Medium' | 'Large';

export interface AdminProduct {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  size: ProductSize;
  material: string;
  shape: string;
  color: string;
  inStock: boolean;
  reviewCount: number;
  description: string;
  image: string | null;
}
