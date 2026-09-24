export interface RevenueData {
  period: string;
  revenue: number;
  orders: number;
}

export interface ProductSales {
  productId: string;
  productName: string;
  quantity: number;
}

export interface AnalyticsData {
  revenue: RevenueData[];
  topSellingProducts: ProductSales[];
}