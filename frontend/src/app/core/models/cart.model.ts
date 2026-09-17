export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  total: number;
  itemCount: number;
}

export interface WishlistState {
  items: WishlistItem[];
  itemCount: number;
}

export interface CartSummary {
  subtotal: number;
  total: number;
  itemCount: number;
}
