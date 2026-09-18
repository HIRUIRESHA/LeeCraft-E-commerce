import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { CheckoutRequest } from '../../core/models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe],
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

          <button type="submit" class="btn btn-primary btn-block" [disabled]="form.invalid || cart.cartItems().length === 0">
            Place Order
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
          <div class="sum-row"><span>Subtotal</span><span>Rs. {{ cart.subtotal() | number }}</span></div>
          <div class="sum-row"><span>Shipping</span><span>Rs. {{ cart.shipping() | number }}</span></div>
          <div class="sum-row total"><span>Total</span><span>Rs. {{ cart.total() | number }}</span></div>
        </div>
      </form>
    </div>
  `,
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  public cart = inject(CartService);
  private orders = inject(OrderService);
  private router = inject(Router);

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

  submit(): void {
    if (this.form.invalid) return;

    const req: CheckoutRequest = {
      ...(this.form.getRawValue() as Omit<CheckoutRequest, 'items'>),
      items: this.cart.cartItems().map((i) => ({ productId: i.productId, qty: i.quantity })),
    };

    this.orders.place(req).subscribe((order) => {
      this.cart.clear();
      this.router.navigate(['/order-confirmation', order.id]);
    });
  }
}
