export interface Promotion {
  id: number;
  title: string;
  code: string;
  description?: string;
  discountPercent: number;
  active: boolean;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PromotionRequest {
  title: string;
  code: string;
  description?: string;
  discountPercent: number;
  active: boolean;
  startDate: string;
  endDate: string;
}
