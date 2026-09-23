import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { CheckoutRequest } from '../../core/models/order.model';
import { PromotionService, PromotionValidationResponse } from '../../core/services/promotion.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, DecimalPipe],
  template: `
    <div class="wrap section">
      <div class="eyebrow">Checkout</div>
      <h1 class="serif" style="font-size:32px;font-weight:500;margin:10px 0 34px;">Checkout</h1>

      <form [formGroup]="form" (ngSubmit)="submit()" class="co-layout">
        <div>
          <div class="co-section">
            <h3>Customer Information</h3>
            <div class="form-row">
              <div class="field"><label>Full Name</label><input type="text" formControlName="fullName" /></div>
              <div class="field"><label>Email</label><input type="email" formControlName="email" /></div>
            </div>
            <div class="field"><label>Contact Number</label><input type="tel" formControlName="contactNumber" placeholder="07X XXX XXXX" /></div>
          </div>

          <div class="co-section">
            <h3>Delivery Address</h3>
            <div class="field"><label>Address</label><input type="text" formControlName="address" /></div>
            <div class="form-row">
              <div class="field"><label>City</label><input type="text" formControlName="city" /></div>
              <div class="field"><label>Postal Code</label><input type="text" formControlName="postalCode" /></div>
            </div>
          </div>

          <div class="co-section">
            <h3>Shipping Method</h3>
            <label class="radio-card">
              <input type="radio" formControlName="shippingMethod" value="STANDARD" /> Standard Delivery &mdash; 3&ndash;5 days &mdash; Rs. 400
            </label>
            <label class="radio-card">
              <input type="radio" formControlName="shippingMethod" value="EXPRESS" /> Express Delivery &mdash; 1&ndash;2 days (Colombo only) &mdash; Rs. 850
            </label>
          </div>

          <div class="co-section">
            <h3>Preferred Contact Method</h3>
            <label class="radio-card">
              <input type="radio" formControlName="contactPreference" value="PHONE" /> Phone Call
            </label>
            <label class="radio-card">
              <input type="radio" formControlName="contactPreference" value="WHATSAPP" /> WhatsApp
            </label>
            <label class="radio-card">
              <input type="radio" formControlName="contactPreference" value="EMAIL" /> Email
            </label>
            <div class="secure-note">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--wood-500)" stroke-width="1.7"><rect x="4" y="10" width="16" height="10" rx="1"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
              No payment needed now &mdash; our team will contact you to confirm your order and arrange payment.
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="form.invalid || cart.cartItems().length === 0 || isSubmitting()">
            {{ isSubmitting() ? 'Placing Order...' : 'Place Order' }}
          </button>
        </div>

        <div class="cart-summary">
          <h3 style="margin-top:0;font-size:16px;">Order Summary</h3>
          <div style="margin-bottom:16px;">
            @for (item of cart.cartItems(); track item.productId) {
              <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:8px;">
                <span>{{ item.name }} &times; {{ item.quantity }}</span>
                <span>Rs. {{ item.price * item.quantity | number }}</span>
              </div>
            }
          </div>

          <!-- Promo Code Section -->
          <div class="promo-box">
            <label style="display:block;font-size:12.5px;font-weight:600;margin-bottom:6px;color:var(--wood-800);">
              Promotional Code
            </label>
            @if (appliedPromo(); as promo) {
              <div class="applied-badge">
                <div class="promo-info">
                  <span class="promo-code">{{ promo.code }}</span>
                  <span class="promo-msg">{{ promo.message }}</span>
                </div>
                <button type="button" class="remove-promo-btn" (click)="removePromo()" title="Remove promo code">
                  &times;
                </button>
              </div>
            } @else {
              <div class="promo-input-row">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  [value]="promoInput()"
                  (input)="promoInput.set($any($event.target).value)"
                  (keydown.enter)="$event.preventDefault(); applyPromo()"
                  [disabled]="isValidatingPromo()"
                />
                <button
                  type="button"
                  class="btn btn-outline btn-sm"
                  (click)="applyPromo()"
                  [disabled]="isValidatingPromo() || !promoInput().trim()"
                >
                  {{ isValidatingPromo() ? '...' : 'Apply' }}
                </button>
              </div>
              @if (promoError()) {
                <div class="promo-error">{{ promoError() }}</div>
              }
            }
          </div>

          <div class="sum-row"><span>Subtotal</span><span>Rs. {{ cart.subtotal() | number }}</span></div>
          @if (discountAmount() > 0) {
            <div class="sum-row discount">
              <span>Discount ({{ appliedPromo()?.code }})</span>
              <span>- Rs. {{ discountAmount() | number }}</span>
            </div>
          }
          <div class="sum-row"><span>Shipping</span><span>Rs. {{ cart.shipping() | number }}</span></div>
          <div class="sum-row total"><span>Total</span><span>Rs. {{ finalTotal() | number }}</span></div>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .promo-box {
      background: var(--cream, #fcf9f5);
      border: 1px dashed var(--line, #e2d9cf);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 16px;
    }
    .promo-input-row {
      display: flex;
      gap: 8px;
    }
    .promo-input-row input {
      flex: 1;
      padding: 7px 10px;
      font-size: 13px;
      border: 1px solid var(--line, #e2d9cf);
      border-radius: 6px;
      text-transform: uppercase;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
    .applied-badge {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      padding: 8px 12px;
      border-radius: 6px;
    }
    .promo-info {
      display: flex;
      flex-direction: column;
    }
    .promo-code {
      font-weight: 700;
      font-size: 13px;
      color: #166534;
    }
    .promo-msg {
      font-size: 11.5px;
      color: #15803d;
    }
    .remove-promo-btn {
      background: none;
      border: none;
      font-size: 18px;
      color: #991b1b;
      cursor: pointer;
      padding: 0 4px;
      line-height: 1;
    }
    .promo-error {
      color: var(--danger, #dc2626);
      font-size: 12px;
      margin-top: 6px;
    }
    .sum-row.discount {
      color: #16a34a;
      font-weight: 600;
    }
  `],
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  public cart = inject(CartService);
  private orders = inject(OrderService);
  private promoService = inject(PromotionService);
  private router = inject(Router);

  promoInput = signal('');
  appliedPromo = signal<PromotionValidationResponse | null>(null);
  promoError = signal<string | null>(null);
  isValidatingPromo = signal(false);
  isSubmitting = signal(false);

  discountAmount = computed(() => (this.appliedPromo() ? this.appliedPromo()!.discountAmount : 0));
  finalTotal = computed(() => Math.max(0, this.cart.subtotal() - this.discountAmount()) + this.cart.shipping());

  form = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    contactNumber: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', Validators.required],
    shippingMethod: ['STANDARD' as const, Validators.required],
    contactPreference: ['PHONE' as const, Validators.required],
  });

  applyPromo(): void {
    const code = this.promoInput().trim();
    if (!code) return;

    this.isValidatingPromo.set(true);
    this.promoError.set(null);

    this.promoService.validatePromotion(code, this.cart.subtotal()).subscribe({
      next: (res) => {
        this.isValidatingPromo.set(false);
        if (res.valid) {
          this.appliedPromo.set(res);
          this.promoError.set(null);
        } else {
          this.appliedPromo.set(null);
          this.promoError.set(res.message || 'Invalid promotion code.');
        }
      },
      error: (err) => {
        this.isValidatingPromo.set(false);
        this.appliedPromo.set(null);
        this.promoError.set(err.error?.message || 'Failed to validate promo code.');
      },
    });
  }

  removePromo(): void {
    this.appliedPromo.set(null);
    this.promoInput.set('');
    this.promoError.set(null);
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    const req: CheckoutRequest = {
      ...(this.form.getRawValue() as Omit<CheckoutRequest, 'items'>),
      items: this.cart.cartItems().map((i) => ({
  productId: String(i.productId),
  productName: i.name,
  unitPrice: i.price,
  qty: i.quantity
})),
    };

    this.orders.place(req).subscribe({
      next: (order) => {
        this.cart.clear();
        this.router.navigate(['/order-confirmation', order.id]);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        alert(err.error?.message || 'Failed to place order. Please try again.');
      },
    });
  }
}
