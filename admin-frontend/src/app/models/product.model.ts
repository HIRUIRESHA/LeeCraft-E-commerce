export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  material: string;
  size: string;
  shape: string;
  color: string;
  stockQuantity: number;
  categoryId: number;
  categoryName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  material: string;
  size: string;
  shape: string;
  color: string;
  stockQuantity: number;
  categoryId: number;
}

export interface StockUpdateRequest {
  stockQuantity: number;
}

export const MATERIAL_OPTIONS = ['Bamboo', 'Mahogany', 'Olive Wood', 'Rosewood', 'Teak', 'Walnut'];
export const SIZE_OPTIONS = ['Small', 'Medium', 'Large'];
export const SHAPE_OPTIONS = ['Hexagon', 'Paddle', 'Rectangle', 'Round'];
export const COLOR_OPTIONS = ['Dark Brown', 'Espresso', 'Golden Brown', 'Light Tan'];