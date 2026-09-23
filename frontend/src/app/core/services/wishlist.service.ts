import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  Injectable,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

import {
  WishlistState,
} from '../models/cart.model';

import { Product } from '../models/product.model';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notify = inject(NotificationService);

  private readonly apiUrl = `${environment.apiUrl}/wishlist`;

  /**
   * Wishlist state is kept only in Angular memory.
   * The actual wishlist data is stored in the backend database.
   */
  private readonly wishlistState = signal<WishlistState>({
    items: [],
    itemCount: 0,
  });

  constructor() {
    /**
     * When the user logs in:
     *   Load their wishlist from the backend.
     *
     * When the user logs out:
     *   Clear only the Angular memory state.
     *
     * No wishlist data is stored in localStorage.
     */
    effect(() => {
      const authenticated = this.auth.isAuthenticated();

      if (authenticated) {
        this.loadWishlist();
      } else {
        this.clearWishlistState();
      }
    });
  }

  // ==================================================
  // Reactive state
  // ==================================================

  readonly items = computed(
    () => this.wishlistState().items
  );

  /**
   * Alias used by components that expect wishlistItems.
   */
  readonly wishlistItems = computed(
    () => this.wishlistState().items
  );

  readonly itemCount = computed(
    () => this.wishlistState().itemCount
  );

  readonly state = computed<WishlistState>(() => ({
    items: this.wishlistState().items,
    itemCount: this.wishlistState().itemCount,
  }));

  // ==================================================
  // Load wishlist
  // ==================================================

  loadWishlist(): void {
    if (!this.auth.isAuthenticated()) {
      this.clearWishlistState();
      return;
    }

    this.http
      .get<WishlistState>(this.apiUrl)
      .subscribe({
        next: (wishlist: WishlistState) => {
          this.wishlistState.set(wishlist);
        },

        error: (error: HttpErrorResponse) => {
          console.error(
            'Failed to load wishlist:',
            error
          );

          if (error.status === 401) {
            this.handleUnauthorized();
          }
        },
      });
  }

  // ==================================================
  // Add product to wishlist
  // ==================================================

  addToWishlist(product: Product): void {
    if (!this.auth.isAuthenticated()) {
      this.redirectToLogin();
      return;
    }

    if (!product) {
      return;
    }

    this.http
      .post<WishlistState>(
        `${this.apiUrl}/items/${product.id}`,
        {}
      )
      .subscribe({
        next: (wishlist: WishlistState) => {
          this.wishlistState.set(wishlist);

          this.notify.success(
            'Product added to your wishlist.'
          );
        },

        error: (error: HttpErrorResponse) => {
          console.error(
            'Failed to add product to wishlist:',
            error
          );

          if (error.status === 401) {
            this.handleUnauthorized();
            return;
          }

          const message =
            error.error?.message ||
            'Unable to add product to wishlist.';

          this.notify.error(message);
        },
      });
  }

  // ==================================================
  // Remove product from wishlist
  // ==================================================

  removeFromWishlist(productId: number): void {
    if (!this.auth.isAuthenticated()) {
      this.clearWishlistState();
      return;
    }

    this.http
      .delete<WishlistState>(
        `${this.apiUrl}/items/${productId}`
      )
      .subscribe({
        next: (wishlist: WishlistState) => {
          this.wishlistState.set(wishlist);

          this.notify.success(
            'Product removed from your wishlist.'
          );
        },

        error: (error: HttpErrorResponse) => {
          console.error(
            'Failed to remove product from wishlist:',
            error
          );

          if (error.status === 401) {
            this.handleUnauthorized();
            return;
          }

          const message =
            error.error?.message ||
            'Unable to remove product from wishlist.';

          this.notify.error(message);
        },
      });
  }

  // ==================================================
  // Toggle wishlist
  // ==================================================

  toggleWishlist(product: Product): void {
    if (!this.auth.isAuthenticated()) {
      this.redirectToLogin();
      return;
    }

    if (!product) {
      return;
    }

    if (this.isInWishlist(product.id)) {
      this.removeFromWishlist(product.id);
    } else {
      this.addToWishlist(product);
    }
  }

  // ==================================================
  // Check wishlist
  // ==================================================

  isInWishlist(productId: number): boolean {
    return this.wishlistState()
      .items
      .some(
        (item) => item.productId === productId
      );
  }

  // ==================================================
  // Clear wishlist from backend
  // ==================================================

  clearWishlist(): void {
    if (!this.auth.isAuthenticated()) {
      this.clearWishlistState();
      return;
    }

    this.http
      .delete<void>(this.apiUrl)
      .subscribe({
        next: () => {
          this.clearWishlistState();

          this.notify.success(
            'Wishlist cleared.'
          );
        },

        error: (error: HttpErrorResponse) => {
          console.error(
            'Failed to clear wishlist:',
            error
          );

          if (error.status === 401) {
            this.handleUnauthorized();
            return;
          }

          const message =
            error.error?.message ||
            'Unable to clear wishlist.';

          this.notify.error(message);
        },
      });
  }

  // ==================================================
  // Alias
  // ==================================================

  clear(): void {
    this.clearWishlist();
  }

  // ==================================================
  // Clear Angular state only
  // ==================================================

  private clearWishlistState(): void {
    this.wishlistState.set({
      items: [],
      itemCount: 0,
    });
  }

  // ==================================================
  // Login redirect
  // ==================================================

  private redirectToLogin(): void {
    this.notify.error(
      'Please log in to save items to your wishlist.'
    );

    this.router.navigate(
      ['/account/login'],
      {
        queryParams: {
          returnUrl: this.router.url,
        },
      }
    );
  }

  // ==================================================
  // Handle unauthorized response
  // ==================================================

  private handleUnauthorized(): void {
    this.clearWishlistState();

    this.auth.logout();

    this.router.navigate(
      ['/account/login'],
      {
        queryParams: {
          returnUrl: this.router.url,
        },
      }
    );
  }
}