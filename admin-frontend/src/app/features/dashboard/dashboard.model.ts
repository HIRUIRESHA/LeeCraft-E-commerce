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

export interface DashboardProduct {
  id: number | string;
  name: string;
  soldQuantity: number;
}

export interface RecentOrder {
  id: number | string;
  customerName: string;
  total: number;
  status: string;
}

export interface LowStockProduct {
  id: number | string;
  name: string;
  stock: number;
}

export interface OutOfStockProduct {
  id: number | string;
  name: string;
}

export interface DashboardData {
  totalSales: number;
  productCount: number;
  orderCount: number;
  abandonedCartCount: number;
  bestSellingProducts: DashboardProduct[];
  recentOrders: RecentOrder[];
  lowStockProducts: LowStockProduct[];
  outOfStockProducts: OutOfStockProduct[];
  topChatbotQuestions: string[];
}