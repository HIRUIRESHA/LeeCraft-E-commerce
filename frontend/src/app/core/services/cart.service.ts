import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  Injectable,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

import {
  AddToCartRequest,
  CartState,
  CartSummary,
  UpdateCartRequest
} from '../models/cart.model';

import { Product } from '../models/product.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  private readonly apiUrl = `${environment.apiUrl}/cart`;

  private readonly cartState = signal<CartState>({
    items: [],
    subtotal: 0,
    shipping: 0,
    total: 0,
    itemCount: 0
  });

  // -----------------------------
  // Watch authentication changes
  // -----------------------------

  constructor() {
    effect(() => {
      const authenticated = this.authService.isAuthenticated();

      if (authenticated) {
        // User logged in or session restored after refresh
        this.loadCart();
      } else {
        // User logged out
        this.clearCartState();
      }
    });
  }

  // -----------------------------
  // Public cart signals
  // -----------------------------

  readonly items = computed(() => this.cartState().items);

  readonly cartItems = computed(() => this.cartState().items);

  readonly itemCount = computed(() => this.cartState().itemCount);

  readonly subtotal = computed(() => this.cartState().subtotal);

  readonly shipping = computed(() => this.cartState().shipping);

  readonly total = computed(() => this.cartState().total);

  readonly summary = computed<CartSummary>(() => ({
    subtotal: this.cartState().subtotal,
    shipping: this.cartState().shipping,
    total: this.cartState().total,
    itemCount: this.cartState().itemCount
  }));

  // -----------------------------
  // Load cart from backend
  // -----------------------------

  loadCart(): void {

    if (!this.authService.isAuthenticated()) {
      this.clearCartState();
      return;
    }

    this.http
      .get<CartState>(this.apiUrl)
      .subscribe({

        next: (cart: CartState) => {
          this.cartState.set(cart);
        },

        error: (error: HttpErrorResponse) => {

          console.error(
            'Failed to load cart:',
            error
          );

          if (error.status === 401) {
            this.clearCartState();
          }
        }

      });
  }

  // -----------------------------
  // Add product to cart
  // -----------------------------

  addToCart(
    product: Product,
    quantity: number = 1
  ): void {

    if (!this.authService.isAuthenticated()) {

      this.router.navigate(['/account/login'], {
        queryParams: {
          returnUrl: this.router.url
        }
      });

      return;
    }

    const request: AddToCartRequest = {
      productId: product.id,
      quantity: quantity
    };

    this.http
      .post<CartState>(
        `${this.apiUrl}/items`,
        request
      )
      .subscribe({

        next: (cart: CartState) => {
          this.cartState.set(cart);
        },

        error: (error: HttpErrorResponse) => {

          console.error(
            'Failed to add product to cart:',
            error
          );

          if (error.status === 401) {

            this.authService.logout();

            this.router.navigate(['/account/login'], {
              queryParams: {
                returnUrl: this.router.url
              }
            });

            return;
          }

          const message =
            error.error?.message ||
            'Unable to add product to cart.';

          alert(message);
        }

      });
  }

  // -----------------------------
  // Remove product
  // -----------------------------

  removeFromCart(productId: number): void {

    if (!this.authService.isAuthenticated()) {
      this.clearCartState();
      return;
    }

    this.http
      .delete<CartState>(
        `${this.apiUrl}/items/${productId}`
      )
      .subscribe({

        next: (cart: CartState) => {
          this.cartState.set(cart);
        },

        error: (error: HttpErrorResponse) => {

          console.error(
            'Failed to remove product from cart:',
            error
          );

          const message =
            error.error?.message ||
            'Unable to remove product from cart.';

          alert(message);
        }

      });
  }

  // -----------------------------
  // Increase quantity
  // -----------------------------

  increaseQuantity(productId: number): void {

    const item = this.cartState()
      .items
      .find(
        item => item.productId === productId
      );

    if (!item) {
      return;
    }

    this.updateQuantity(
      productId,
      item.quantity + 1
    );
  }

  // -----------------------------
  // Decrease quantity
  // -----------------------------

  decreaseQuantity(productId: number): void {

    const item = this.cartState()
      .items
      .find(
        item => item.productId === productId
      );

    if (!item) {
      return;
    }

    if (item.quantity <= 1) {

      this.removeFromCart(productId);

      return;
    }

    this.updateQuantity(
      productId,
      item.quantity - 1
    );
  }

  // -----------------------------
  // Update quantity
  // -----------------------------

  private updateQuantity(
    productId: number,
    quantity: number
  ): void {

    if (!this.authService.isAuthenticated()) {
      this.clearCartState();
      return;
    }

    const request: UpdateCartRequest = {
      quantity: quantity
    };

    this.http
      .put<CartState>(
        `${this.apiUrl}/items/${productId}`,
        request
      )
      .subscribe({

        next: (cart: CartState) => {
          this.cartState.set(cart);
        },

        error: (error: HttpErrorResponse) => {

          console.error(
            'Failed to update cart quantity:',
            error
          );

          const message =
            error.error?.message ||
            'Unable to update cart quantity.';

          alert(message);
        }

      });
  }

  // -----------------------------
  // Clear entire cart
  // -----------------------------

  clearCart(): void {

    if (!this.authService.isAuthenticated()) {
      this.clearCartState();
      return;
    }

    this.http
      .delete<void>(this.apiUrl)
      .subscribe({

        next: () => {
          this.clearCartState();
        },

        error: (error: HttpErrorResponse) => {

          console.error(
            'Failed to clear cart:',
            error
          );
        }

      });
  }

  // Keep this method for existing components
  clear(): void {
    this.clearCart();
  }

  // -----------------------------
  // Check whether product is in cart
  // -----------------------------

  isInCart(productId: number): boolean {

    return this.cartState()
      .items
      .some(
        item => item.productId === productId
      );
  }

  // -----------------------------
  // Clear local Angular state
  // -----------------------------

  private clearCartState(): void {

    this.cartState.set({
      items: [],
      subtotal: 0,
      shipping: 0,
      total: 0,
      itemCount: 0
    });
  }
}