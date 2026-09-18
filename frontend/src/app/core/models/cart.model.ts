export interface CartItem {
  productId: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

export interface WishlistItem {
  productId: number;
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
