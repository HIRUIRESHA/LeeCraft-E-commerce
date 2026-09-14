import { Product } from './product.model';

export interface CartItem {
  product: Product;
  qty: number;
}

export type ContactMethod = 'PHONE' | 'WHATSAPP' | 'EMAIL';
export type ShippingMethod = 'STANDARD' | 'EXPRESS';

export interface CheckoutRequest {
  fullName: string;
  email: string;
  contactNumber: string;
  address: string;
  city: string;
  postalCode: string;
  shippingMethod: ShippingMethod;
  contactPreference: ContactMethod;
  items: { productId: string; qty: number }[];
}

export interface Order {
  id: string;
  status: 'PLACED' | 'PACKED' | 'SHIPPED' | 'DELIVERED';
  total: number;
  createdAt: string;
}
