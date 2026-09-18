import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  template: `
    <div class="wrap section cart-page">
      <div class="eyebrow">Cart</div>
      <h1 class="serif" style="font-size:32px;font-weight:500;margin:10px 0 30px;">Your Shopping Cart</h1>

      @if (cartItems().length === 0) {
        <div class="empty-state card">
          <p>Your cart is empty.</p>
          <a routerLink="/shop" class="btn btn-primary">Continue Shopping</a>
        </div>
      } @else {
        <div class="cart-layout">
          <div class="cart-list">
            @for (item of cartItems(); track item.productId) {
              <div class="cart-item card">
                <div class="thumb" [style.background-image]="item.image ? 'url(' + item.image + ')' : 'linear-gradient(135deg, #d6b58d, #8b5e3c)'">
                  @if (!item.image) {
                    <span>Board</span>
                  }
                </div>

                <div class="item-details">
                  <h3>{{ item.name }}</h3>
                  <p>Rs. {{ item.price | number }}</p>
                </div>

                <div class="qty-box">
                  <button type="button" (click)="decrease(item.productId)">-</button>
                  <span>{{ item.quantity }}</span>
                  <button type="button" (click)="increase(item.productId)">+</button>
                </div>

                <div class="item-total">Rs. {{ item.price * item.quantity | number }}</div>

                <button type="button" class="remove-btn" (click)="remove(item.productId)">Remove</button>
              </div>
            }
          </div>

          <aside class="summary card">
            <h3>Order Summary</h3>
            <div class="summary-row">
              <span>Subtotal</span>
              <strong>Rs. {{ subtotal() | number }}</strong>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <strong>Calculated at checkout</strong>
            </div>
            <div class="summary-row total-row">
              <span>Total</span>
              <strong>Rs. {{ total() | number }}</strong>
            </div>
            <button class="btn btn-primary btn-block" routerLink="/checkout">Proceed to Checkout</button>
          </aside>
        </div>
      }
    </div>
  `,
  styles: [`
    .cart-layout {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
      align-items: start;
    }
    .cart-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .cart-item {
      display: grid;
      grid-template-columns: 110px 1.4fr 150px 120px 90px;
      gap: 16px;
      align-items: center;
      padding: 16px;
    }
    .thumb {
      width: 110px;
      height: 110px;
      border-radius: 12px;
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      letter-spacing: .5px;
    }
    .item-details h3 {
      margin: 0 0 6px;
      font-size: 18px;
    }
    .item-details p {
      margin: 0;
      color: var(--wood-700);
    }
    .qty-box {
      display: flex;
      align-items: center;
      border: 1px solid var(--line);
      border-radius: 10px;
      overflow: hidden;
      width: fit-content;
    }
    .qty-box button {
      width: 36px;
      height: 36px;
      border: none;
      background: #f7f1eb;
      cursor: pointer;
      font-size: 18px;
    }
    .qty-box span {
      width: 42px;
      text-align: center;
      font-weight: 600;
    }
    .item-total {
      font-weight: 700;
      color: var(--wood-800);
      text-align: right;
    }
    .remove-btn {
      border: none;
      background: transparent;
      color: #a24a3b;
      cursor: pointer;
      text-align: right;
      font-weight: 600;
    }
    .summary {
      padding: 20px;
      position: sticky;
      top: 90px;
    }
    .summary h3 {
      margin: 0 0 16px;
      font-size: 22px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid var(--line);
      color: var(--wood-700);
    }
    .total-row {
      margin-top: 8px;
      font-size: 18px;
      color: var(--wood-900);
      font-weight: 700;
    }
    .empty-state {
      padding: 40px 20px;
      text-align: center;
    }
    .empty-state p {
      margin: 0 0 18px;
      font-size: 18px;
      color: var(--wood-700);
    }
    @media (max-width: 860px) {
      .cart-layout { grid-template-columns: 1fr; }
      .cart-item {
        grid-template-columns: 90px 1fr;
      }
      .qty-box, .item-total, .remove-btn {
        grid-column: 2;
      }
    }
  `],
})
export class CartComponent {
  private cartService = inject(CartService);

  readonly cartItems = this.cartService.items;
  readonly subtotal = this.cartService.subtotal;
  readonly total = this.cartService.total;

  increase(productId: string): void {
    this.cartService.increaseQuantity(productId);
  }

  decrease(productId: string): void {
    this.cartService.decreaseQuantity(productId);
  }

  remove(productId: string): void {
    this.cartService.removeFromCart(productId);
  }
}
