export type ProductSize = 'Small' | 'Medium' | 'Large' | string;

export interface Product {
  id: number;
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

  // Backend fields
  stockQuantity: number;
  categoryId: number;
  categoryName: string;
}