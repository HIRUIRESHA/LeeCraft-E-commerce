import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { WishlistItem, WishlistState } from '../models/cart.model';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

const STORAGE_KEY = 'leecraft_wishlist';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notify = inject(NotificationService);

  private readonly wishlistItems = signal<WishlistItem[]>(this.loadFromStorage());

  readonly items = this.wishlistItems.asReadonly();
  readonly itemCount = computed(() => this.wishlistItems().length);
  readonly state = computed<WishlistState>(() => ({
    items: this.wishlistItems(),
    itemCount: this.itemCount(),
  }));

  addToWishlist(product: Product): boolean {
    if (!this.auth.isAuthenticated()) {
      this.notify.error('Please log in to save items to your wishlist.');
      this.router.navigate(['/account/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return false;
    }

    if (!product) {
      return false;
    }

    const current = this.wishlistItems();
    const exists = current.some((item) => item.productId === product.id);

    if (exists) {
      return false;
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
    return true;
  }

  removeFromWishlist(productId: number): void {
    this.wishlistItems.set(this.wishlistItems().filter((item) => item.productId !== productId));
    this.persist();
  }

  toggleWishlist(product: Product): boolean | null {
    if (!this.auth.isAuthenticated()) {
      this.notify.error('Please log in to save items to your wishlist.');
      this.router.navigate(['/account/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return null;
    }

    if (this.isInWishlist(product.id)) {
      this.removeFromWishlist(product.id);
      return false;
    }

    this.addToWishlist(product);
    return true;
  }

  isInWishlist(productId: number): boolean {
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
