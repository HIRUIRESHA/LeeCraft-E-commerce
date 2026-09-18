import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem, CartSummary } from '../models/cart.model';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

const STORAGE_KEY = 'leecraft_cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notify = inject(NotificationService);

  private readonly cartItemsSignal = signal<CartItem[]>(this.loadFromStorage());

  readonly items = this.cartItemsSignal.asReadonly();
  readonly cartItems = this.cartItemsSignal.asReadonly();
  readonly itemCount = computed(() => this.cartItemsSignal().reduce((sum, item) => sum + item.quantity, 0));
  readonly subtotal = computed(() =>
    this.cartItemsSignal().reduce((sum, item) => sum + item.price * item.quantity, 0),
  );
  readonly shipping = computed(() => (this.subtotal() >= 8000 ? 0 : 400));
  readonly total = computed(() => this.subtotal() + this.shipping());
  readonly summary = computed<CartSummary>(() => ({
    subtotal: this.subtotal(),
    total: this.total(),
    itemCount: this.itemCount(),
  }));

  addToCart(product: Product, quantity: number = 1): boolean {
    if (!this.auth.isAuthenticated()) {
      this.notify.error('Please log in to add items to your cart.');
      this.router.navigate(['/account/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return false;
    }

    if (!product || quantity <= 0) {
      return false;
    }

    const current = this.cartItemsSignal();
    const existingItem = current.find((item) => item.productId === product.id);

    if (existingItem) {
      this.cartItemsSignal.set(
        current.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        ),
      );
    } else {
      this.cartItemsSignal.set([
        ...current,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        },
      ]);
    }

    this.persist();
    return true;
  }

  removeFromCart(productId: number): void {
    this.cartItemsSignal.set(this.cartItemsSignal().filter((item) => item.productId !== productId));
    this.persist();
  }

  increaseQuantity(productId: number): void {
    this.updateQuantity(productId, 1);
  }

  decreaseQuantity(productId: number): void {
    const item = this.cartItemsSignal().find((cartItem) => cartItem.productId === productId);

    if (!item) {
      return;
    }

    if (item.quantity <= 1) {
      this.removeFromCart(productId);
      return;
    }

    this.updateQuantity(productId, -1);
  }

  clearCart(): void {
    this.cartItemsSignal.set([]);
    this.persist();
  }

  clear(): void {
    this.clearCart();
  }

  isInCart(productId: number): boolean {
    return this.cartItemsSignal().some((item) => item.productId === productId);
  }

  private updateQuantity(productId: number, change: number): void {
    this.cartItemsSignal.set(
      this.cartItemsSignal().map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item,
      ).filter((item) => item.quantity > 0),
    );

    this.persist();
  }

  private persist(): void {
    const value = JSON.stringify(this.cartItemsSignal());

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, value);
    }
  }

  private loadFromStorage(): CartItem[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as CartItem[]) : [];
    } catch {
      return [];
    }
  }
}
