import { Product } from './product.model';

export interface CartItem {
  product: Product;
  qty: number;
}

export type ContactMethod = 'PHONE' | 'WHATSAPP' | 'EMAIL';
export type ShippingMethod = 'STANDARD' | 'EXPRESS';
export type OrderStatus = 'PLACED' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface CheckoutItemRequest {
  productId: string | number;
  productName?: string;
  unitPrice?: number;
  qty: number;
}

export interface CheckoutRequest {
  fullName: string;
  email: string;
  contactNumber: string;
  address: string;
  city: string;
  postalCode: string;
  shippingMethod: ShippingMethod;
  contactPreference: ContactMethod;
  items: CheckoutItemRequest[];
  promoCode?: string;
}

export interface OrderItemResponse {
  productId: string;
  productName: string;
  unitPrice: number;
  qty: number;
  lineTotal: number;
}

export interface Order {
  id: string; // Order Number (e.g. LC-12345)
  status: OrderStatus;
  fullName?: string;
  email?: string;
  contactNumber?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  shippingMethod?: ShippingMethod;
  contactPreference?: ContactMethod;
  subtotal?: number;
  promoCode?: string;
  discountAmount?: number;
  shippingCost?: number;
  total: number;
  createdAt: string;
  items?: OrderItemResponse[];
  whatsappLink?: string;
}
