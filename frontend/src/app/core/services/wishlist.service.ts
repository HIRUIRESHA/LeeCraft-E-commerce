import { Injectable, computed, signal } from '@angular/core';
import { WishlistItem, WishlistState } from '../models/cart.model';
import { Product } from '../models/product.model';

const STORAGE_KEY = 'leecraft_wishlist';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly wishlistItems = signal<WishlistItem[]>(this.loadFromStorage());

  readonly items = this.wishlistItems.asReadonly();
  readonly itemCount = computed(() => this.wishlistItems().length);
  readonly state = computed<WishlistState>(() => ({
    items: this.wishlistItems(),
    itemCount: this.itemCount(),
  }));

  addToWishlist(product: Product): void {
    if (!product) {
      return;
    }

    const current = this.wishlistItems();
    const exists = current.some((item) => item.productId === product.id);

    if (exists) {
      return;
    }

    this.wishlistItems.set([
      ...current,
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
    ]);

    this.persist();
  }

  removeFromWishlist(productId: string): void {
    this.wishlistItems.set(this.wishlistItems().filter((item) => item.productId !== productId));
    this.persist();
  }

  toggleWishlist(product: Product): boolean {
    if (this.isInWishlist(product.id)) {
      this.removeFromWishlist(product.id);
      return false;
    }

    this.addToWishlist(product);
    return true;
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistItems().some((item) => item.productId === productId);
  }

  clearWishlist(): void {
    this.wishlistItems.set([]);
    this.persist();
  }

  private persist(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.wishlistItems()));
    }
  }

  private loadFromStorage(): WishlistItem[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as WishlistItem[]) : [];
    } catch {
      return [];
    }
  }
}
