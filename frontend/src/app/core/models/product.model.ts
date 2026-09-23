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

export interface Review {
  id: number;
  productId: number;
  reviewerName: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface ProductReviewSummary {
  productId: number;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
  reviews: Review[];
}

export interface CreateReviewRequest {
  reviewerName: string;
  reviewerEmail?: string;
  rating: number;
  comment: string;
}