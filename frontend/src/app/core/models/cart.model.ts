export interface CartItem {
  productId: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartRequest {
  quantity: number;
}

// Keep these because wishlist.service.ts uses them
export interface WishlistItem {
  productId: number;
  name: string;
  price: number;
  image?: string;
}

export interface WishlistState {
  items: WishlistItem[];
  itemCount: number;
}