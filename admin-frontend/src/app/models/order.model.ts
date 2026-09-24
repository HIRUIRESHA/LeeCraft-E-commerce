export type OrderStatus =
  | 'PLACED'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export type ShippingMethod =
  | 'STANDARD'
  | 'EXPRESS';

export type ContactMethod =
  | 'PHONE'
  | 'WHATSAPP'
  | 'EMAIL';

export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  qty: number;
  lineTotal: number;
}

export interface Order {
  id: string;

  status: OrderStatus;

  fullName: string;
  email: string;
  contactNumber: string;

  address: string;
  city: string;
  postalCode: string;

  shippingMethod: ShippingMethod;
  contactPreference: ContactMethod;

  subtotal: number;
  promoCode: string | null;
  discountAmount: number;
  shippingCost: number;
  total: number;

  createdAt: string;

  items: OrderItem[];

  whatsappLink: string | null;
}

export interface OrderPage {
  content: Order[];

  totalElements: number;
  totalPages: number;
  size: number;
  number: number;

  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface OrderStatusUpdateRequest {
  status: OrderStatus;
}