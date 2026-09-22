export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export interface Promotion {
  id: number;
  title: string;
  description?: string;
  code?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usageCount: number;
  active: boolean;
  validNow: boolean;
  bannerUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PromotionRequest {
  title: string;
  description?: string;
  code?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number | null;
  maxDiscountAmount?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  usageLimit?: number | null;
  active: boolean;
  bannerUrl?: string;
}
