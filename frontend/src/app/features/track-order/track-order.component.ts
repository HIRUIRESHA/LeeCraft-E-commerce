import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { Order, OrderStatus } from '../../core/models/order.model';
import { ProductService } from '../../core/services/product.service';
import { CreateReviewRequest } from '../../core/models/product.model';

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, DatePipe],
  template: `
    <div class="wrap section">
      <div class="eyebrow">Order Status</div>
      <h1 class="serif" style="font-size:32px;font-weight:500;margin:10px 0 10px;">
        Track Your Order
      </h1>
      <p style="color:var(--wood-600);font-size:14px;margin-bottom:30px;">
        Enter your LeeCraft order number and email or phone to view live island-wide delivery progress.
      </p>

      <!-- Tracking Search Box -->
      <div class="tracking-search-card">
        <form (ngSubmit)="onTrack()" class="tracking-form">
          <div class="form-row">
            <div class="field">
              <label>Order Number *</label>
              <input
                type="text"
                required
                [ngModel]="orderNumberInput()"
                (ngModelChange)="orderNumberInput.set($event)"
                name="orderNumber"
                placeholder="e.g. LC-12345"
                class="uppercase-input"
              />
            </div>
            <div class="field">
              <label>Email or Phone Number *</label>
              <input
                type="text"
                required
                [ngModel]="contactInput()"
                (ngModelChange)="contactInput.set($event)"
                name="contact"
                placeholder="e.g. customer@example.com or 07X XXX XXXX"
              />
            </div>
            <div class="btn-col">
              <button
                type="submit"
                class="btn btn-primary btn-block"
                [disabled]="isLoading() || !orderNumberInput().trim() || !contactInput().trim()"
              >
                {{ isLoading() ? 'Searching...' : 'Track Order' }}
              </button>
            </div>
          </div>
        </form>

        @if (errorMessage()) {
          <div class="tracking-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ errorMessage() }}
          </div>
        }
      </div>

      <!-- Tracking Result Section -->
      @if (order(); as ord) {
        <div class="tracking-result-box">
          <!-- Top Order Header -->
          <div class="result-header">
            <div>
              <div class="order-title">Order #{{ ord.id }}</div>
              <div class="order-sub">Placed on {{ ord.createdAt | date:'mediumDate' }} &bull; For {{ ord.fullName }}</div>
            </div>
            <div class="status-pill" [ngClass]="'pill-' + ord.status.toLowerCase()">
              {{ getStatusLabel(ord.status) }}
            </div>
          </div>

          <!-- Stepper / Timeline -->
          @if (ord.status === 'CANCELLED') {
            <div class="cancelled-banner">
              ⚠️ This order has been cancelled. If you believe this is a mistake, please reach out to our team on WhatsApp.
            </div>
          } @else {
            <div class="timeline-stepper">
              @for (step of steps; track step.key; let idx = $index) {
                <div
                  class="step-node"
                  [class.completed]="isStepCompleted(ord.status, step.key)"
                  [class.current]="isCurrentStep(ord.status, step.key)"
                >
                  <div class="step-icon-wrap">
                    @if (isStepCompleted(ord.status, step.key)) {
                      <span class="check-icon">✓</span>
                    } @else {
                      <span class="step-num">{{ idx + 1 }}</span>
                    }
                  </div>
                  <div class="step-label">{{ step.label }}</div>
                  <div class="step-desc">{{ step.desc }}</div>
                </div>
                @if (idx < steps.length - 1) {
                  <div
                    class="step-connector"
                    [class.filled]="isStepCompleted(ord.status, steps[idx + 1].key)"
                  ></div>
                }
              }
            </div>
          }

          @if (ord.status === 'DELIVERED') {
            <div class="delivered-celebration-banner">
              <span class="celebration-icon">🎉</span>
              <div class="celebration-content">
                <strong>Your order has arrived!</strong>
                <span>We hope you love your handcrafted items. You can now leave an authentic verified review below to support our local woodcraft artisans.</span>
              </div>
            </div>
          }

          <!-- Details Grid -->
          <div class="details-grid">
            <!-- Left: Delivery & Contact -->
            <div class="details-card">
              <h3>Delivery Details</h3>
              <div class="detail-row">
                <span class="d-label">Recipient:</span>
                <span class="d-val">{{ ord.fullName }}</span>
              </div>
              <div class="detail-row">
                <span class="d-label">Delivery Address:</span>
                <span class="d-val">{{ ord.address }}, {{ ord.city }}</span>
              </div>
              <div class="detail-row">
                <span class="d-label">Shipping Method:</span>
                <span class="d-val">{{ ord.shippingMethod === 'EXPRESS' ? 'Express Delivery (1-2 Days)' : 'Standard Delivery (3-5 Days)' }}</span>
              </div>
              <div class="detail-row">
                <span class="d-label">Contact Preference:</span>
                <span class="d-val">{{ ord.contactPreference }}</span>
              </div>
            </div>

            <!-- Right: Items & Payment -->
            <div class="details-card">
              <h3>Order Summary</h3>
              @if (ord.items && ord.items.length > 0) {
                <div class="items-list">
                  @for (item of ord.items; track item.productId) {
                    <div class="item-line item-with-review">
                      <div class="item-meta">
                        <span class="item-name"><strong>{{ item.productName }}</strong> &times; {{ item.qty }}</span>
                        <span class="item-price">Rs. {{ item.lineTotal | number }}</span>
                      </div>
                      @if (ord.status === 'DELIVERED') {
                        <button
                          type="button"
                          class="btn-review-track"
                          [class.reviewed]="isItemReviewed(ord.id, item.productId)"
                          (click)="openItemReviewModal(ord, item)"
                        >
                          {{ isItemReviewed(ord.id, item.productId) ? '✓ Reviewed' : '★ Review Item' }}
                        </button>
                      }
                    </div>
                  }
                </div>
              }

              <div class="price-totals">
                <div class="p-row">
                  <span>Subtotal</span>
                  <span>Rs. {{ ord.subtotal | number }}</span>
                </div>
                @if (ord.discountAmount && ord.discountAmount > 0) {
                  <div class="p-row discount">
                    <span>Discount ({{ ord.promoCode }})</span>
                    <span>- Rs. {{ ord.discountAmount | number }}</span>
                  </div>
                }
                <div class="p-row">
                  <span>Shipping</span>
                  <span>Rs. {{ (ord.shippingCost || 0) | number }}</span>
                </div>
                <div class="p-row total">
                  <span>Total</span>
                  <span>Rs. {{ ord.total | number }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="result-footer">
            <div style="font-size:13.5px;color:var(--wood-700);">
              Need to modify or have a question about this shipment?
            </div>
            @if (ord.status === 'DELIVERED') {
              <button
                type="button"
                class="btn-store-review"
                (click)="openStoreReviewModal(ord)"
              >
                💬 Review Store Experience
              </button>
            }
            @if (ord.whatsappLink) {
              <a
                [href]="ord.whatsappLink"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-whatsapp-track"
              >
                💬 Ask LeeCraft on WhatsApp
              </a>
            } @else {
              <a
                [href]="getGeneralWhatsApp(ord)"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-whatsapp-track"
              >
                💬 Inquire on WhatsApp
              </a>
            }
          </div>
        </div>
      }

      <!-- ================= POST-DELIVERY REVIEW MODAL ================= -->
      @if (showReviewModal()) {
        <div class="modal-backdrop" (click)="closeReviewModal()">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <div>
                <h3 class="serif" style="margin:0;font-size:22px;">
                  {{ isStoreReview() ? 'Review Store Experience' : 'Review Handcrafted Item' }}
                </h3>
                <span class="modal-subtitle">
                  {{ isStoreReview() ? 'Share your feedback on LeeCraft delivery, packaging, and craftsmanship' : 'Your review helps fellow craft lovers and our local artisans' }}
                </span>
              </div>
              <button type="button" class="modal-close-btn" (click)="closeReviewModal()">&times;</button>
            </div>

            <!-- Target Chip -->
            <div class="review-target-chip">
              <div class="target-icon">{{ isStoreReview() ? '🏬' : '🪵' }}</div>
              <div class="target-details">
                <div class="target-title">
                  {{ isStoreReview() ? 'LeeCraft Store, Delivery & Service Experience' : reviewingItem()?.productName }}
                </div>
                <div class="target-meta">
                  <span class="order-ref">Order #{{ reviewingOrder()?.id }}</span>
                  @if (!isStoreReview() && reviewingItem()?.qty) {
                    <span class="item-bought-detail">Qty: {{ reviewingItem()?.qty }} &bull; Rs. {{ reviewingItem()?.unitPrice | number }}</span>
                  }
                  <span class="verified-tag">✓ Verified Delivery</span>
                </div>
              </div>
            </div>

            @if (reviewSuccessMessage()) {
              <div class="review-success-banner">
                ✓ {{ reviewSuccessMessage() }}
              </div>
            }

            <form (ngSubmit)="submitReview()" class="review-modal-form">
              <!-- Star Rating -->
              <div class="modal-field">
                <label>Your Overall Rating *</label>
                <div class="star-rating-selector">
                  @for (s of [1,2,3,4,5]; track s) {
                    <button
                      type="button"
                      class="star-btn"
                      [class.active]="s <= reviewRating()"
                      (click)="reviewRating.set(s)"
                    >
                      ★
                    </button>
                  }
                  <span class="rating-text-label">
                    {{ getRatingText(reviewRating()) }}
                  </span>
                </div>
              </div>

              <!-- Customer Info Auto-filled -->
              <div class="form-row-2">
                <div class="modal-field">
                  <label>Your Full Name *</label>
                  <input
                    type="text"
                    required
                    [value]="reviewName()"
                    (input)="reviewName.set($any($event.target).value)"
                    placeholder="Your Name"
                  />
                  <span class="field-hint">Auto-filled from your order</span>
                </div>
                <div class="modal-field">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    [value]="reviewEmail()"
                    (input)="reviewEmail.set($any($event.target).value)"
                    placeholder="name@example.com"
                  />
                  <span class="field-hint">Auto-filled &bull; Verified buyer badge</span>
                </div>
              </div>

              <!-- Comment -->
              <div class="modal-field">
                <label>Review &amp; Feedback *</label>
                <textarea
                  rows="4"
                  required
                  [value]="reviewComment()"
                  (input)="reviewComment.set($any($event.target).value)"
                  placeholder="{{ isStoreReview() ? 'How was the packaging, delivery speed, and customer care? Would you recommend LeeCraft to friends?' : 'How is the natural wood grain, heft, finish, and durability? What do you use it for?' }}"
                ></textarea>
              </div>

              @if (reviewErrorMessage()) {
                <div class="modal-error-banner">
                  {{ reviewErrorMessage() }}
                </div>
              }

              <div class="modal-actions">
                <button type="button" class="btn btn-outline" (click)="closeReviewModal()">Cancel</button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="isSubmittingReview() || !reviewComment().trim() || !reviewName().trim()"
                >
                  {{ isSubmittingReview() ? 'Submitting...' : 'Submit Verified Review' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .uppercase-input { text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; }
    .tracking-search-card {
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.02);
      max-width: 820px;
    }
    .tracking-form .form-row {
      display: flex;
      gap: 16px;
      align-items: flex-end;
    }
    .tracking-form .field {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .tracking-form label {
      font-size: 12.5px;
      font-weight: 600;
      color: var(--wood-800);
      margin-bottom: 6px;
    }
    .tracking-form input {
      padding: 9px 12px;
      border: 1px solid var(--line);
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
    }
    .btn-col {
      min-width: 150px;
    }
    .tracking-error {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 14px;
      padding: 10px 14px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 6px;
      color: #b91c1c;
      font-size: 13px;
    }

    /* Results Box */
    .tracking-result-box {
      margin-top: 36px;
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 8px;
      overflow: hidden;
      max-width: 820px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.03);
    }
    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: #faf8f5;
      border-bottom: 1px solid var(--line);
    }
    .order-title { font-size: 18px; font-weight: 700; color: var(--wood-900); }
    .order-sub { font-size: 12.5px; color: var(--wood-500); margin-top: 2px; }
    .status-pill {
      font-size: 12.5px;
      font-weight: 700;
      padding: 5px 12px;
      border-radius: 999px;
    }
    .pill-placed { background: #eff6ff; color: #1d4ed8; }
    .pill-packed { background: #fefce8; color: #a16207; }
    .pill-shipped { background: #faf5ff; color: #7e22ce; }
    .pill-delivered { background: #f0fdf4; color: #15803d; }
    .pill-cancelled { background: #fef2f2; color: #b91c1c; }

    .cancelled-banner {
      margin: 24px;
      padding: 14px 18px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
      border-radius: 6px;
      font-size: 14px;
    }

    /* Stepper / Timeline */
    .timeline-stepper {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 36px 30px 24px;
      background: #fff;
      border-bottom: 1px solid var(--line);
    }
    .step-node {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      flex: 1;
      position: relative;
    }
    .step-icon-wrap {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #f3f4f6;
      border: 2px solid #e5e7eb;
      color: #9ca3af;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      margin-bottom: 10px;
      transition: all 0.2s ease;
      z-index: 2;
    }
    .step-node.completed .step-icon-wrap {
      background: #16a34a;
      border-color: #16a34a;
      color: #fff;
    }
    .step-node.current .step-icon-wrap {
      background: var(--wood-800);
      border-color: var(--wood-800);
      color: #fff;
      box-shadow: 0 0 0 4px rgba(120, 80, 50, 0.15);
    }
    .step-connector {
      flex: 1;
      height: 3px;
      background: #e5e7eb;
      margin-top: 18px;
      transition: background 0.3s ease;
    }
    .step-connector.filled {
      background: #16a34a;
    }
    .step-label { font-size: 13px; font-weight: 600; color: var(--wood-900); }
    .step-desc { font-size: 11px; color: var(--wood-500); margin-top: 2px; }

    /* Details Grid */
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      padding: 24px;
    }
    .details-card {
      background: #faf8f5;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 18px 20px;
    }
    .details-card h3 {
      font-size: 14px;
      font-weight: 700;
      color: var(--wood-900);
      margin: 0 0 14px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      margin-bottom: 8px;
    }
    .d-label { color: var(--wood-500); }
    .d-val { color: var(--wood-900); font-weight: 500; text-align: right; }

    .items-list {
      border-bottom: 1px solid var(--line);
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
    .item-line {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      margin-bottom: 6px;
    }
    .price-totals {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .p-row {
      display: flex;
      justify-content: space-between;
      font-size: 12.5px;
      color: var(--wood-700);
    }
    .p-row.discount { color: #16a34a; font-weight: 600; }
    .p-row.total {
      font-size: 15px;
      font-weight: 700;
      color: var(--wood-900);
      border-top: 1px solid var(--line);
      padding-top: 6px;
      margin-top: 4px;
    }

    .result-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: #faf8f5;
      border-top: 1px solid var(--line);
      flex-wrap: wrap;
      gap: 12px;
    }
    .btn-whatsapp-track {
      background: #25d366;
      color: #fff !important;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-whatsapp-track:hover { background: #1ebd5a; }

    /* Delivered celebration banner */
    .delivered-celebration-banner {
      display: flex;
      align-items: center;
      gap: 14px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 14px 18px;
      margin-bottom: 24px;
    }
    .celebration-icon {
      font-size: 28px;
    }
    .celebration-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 13px;
      color: #166534;
    }
    .celebration-content strong {
      font-size: 14px;
      color: #14532d;
    }

    .item-with-review {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 0;
      border-bottom: 1px dashed #f0ede8;
    }
    .item-with-review:last-child {
      border-bottom: none;
    }
    .item-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .item-amt {
      color: var(--wood-600);
      font-size: 12px;
    }
    .btn-review-track {
      background: #fff;
      color: var(--wood-900);
      border: 1px solid var(--wood-700);
      padding: 4px 10px;
      font-size: 11.5px;
      font-weight: 600;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .btn-review-track:hover {
      background: var(--wood-900);
      color: #fff;
    }
    .btn-review-track.reviewed {
      background: #f0fdf4;
      color: #166534;
      border-color: #bbf7d0;
      cursor: default;
    }
    .btn-store-review {
      background: #fefce8;
      color: #854d0e;
      border: 1px solid #fde047;
      padding: 6px 14px;
      font-size: 12.5px;
      font-weight: 600;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-store-review:hover {
      background: #fef08a;
    }

    /* Modal Styles */
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .modal-card {
      background: #fff;
      border-radius: 10px;
      width: 100%;
      max-width: 540px;
      padding: 28px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.18);
      max-height: 90vh;
      overflow-y: auto;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 18px;
    }
    .modal-subtitle {
      font-size: 12.5px;
      color: var(--wood-600);
      margin-top: 4px;
      display: block;
    }
    .modal-close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: var(--wood-600);
      line-height: 1;
    }
    .review-target-chip {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #fdfaf6;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 20px;
    }
    .target-icon { font-size: 24px; }
    .target-title { font-weight: 600; color: var(--wood-900); font-size: 14px; }
    .target-meta { display: flex; gap: 10px; align-items: center; margin-top: 2px; font-size: 12px; }
    .order-ref { color: var(--wood-600); }
    .item-bought-detail {
      background: #f3eee7;
      color: var(--wood-800);
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
    }
    .verified-tag { color: #16a34a; font-weight: 600; }
    .star-rating-selector { display: flex; align-items: center; gap: 6px; margin-top: 6px; }
    .star-btn {
      background: none;
      border: none;
      font-size: 26px;
      color: #d1c7bc;
      cursor: pointer;
      padding: 0 2px;
      transition: color 0.15s;
    }
    .star-btn.active { color: #d97706; }
    .rating-text-label { font-size: 12px; color: var(--wood-700); margin-left: 8px; font-weight: 500; }
    .review-modal-form { display: flex; flex-direction: column; gap: 16px; }
    .modal-field { display: flex; flex-direction: column; gap: 6px; }
    .modal-field label { font-size: 12.5px; font-weight: 600; color: var(--wood-800); }
    .modal-field input, .modal-field textarea {
      padding: 9px 12px;
      border: 1px solid var(--line);
      border-radius: 5px;
      font-size: 13.5px;
      font-family: inherit;
    }
    .modal-field input:focus, .modal-field textarea:focus { outline: none; border-color: var(--wood-800); }
    .field-hint { font-size: 11px; color: var(--wood-500); }
    .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .review-success-banner {
      background: #f0fdf4;
      color: #166534;
      border: 1px solid #bbf7d0;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 13px;
      margin-bottom: 16px;
    }
    .modal-error-banner {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 13px;
    }
    .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }

    @media (max-width: 768px) {
      .tracking-form .form-row { flex-direction: column; align-items: stretch; }
      .details-grid { grid-template-columns: 1fr; }
      .timeline-stepper { flex-direction: column; gap: 16px; align-items: flex-start; padding: 20px; }
      .step-node { flex-direction: row; gap: 14px; text-align: left; }
      .step-connector { display: none; }
    }
  `],
})
export class TrackOrderComponent implements OnInit {
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  // Review modal state
  showReviewModal = signal(false);
  reviewingOrder = signal<Order | null>(null);
  reviewingItem = signal<{ productId: string; productName: string; qty?: number; unitPrice?: number } | null>(null);
  isStoreReview = signal(false);
  reviewedItems = signal<Set<string>>(new Set());

  reviewRating = signal(5);
  reviewComment = signal('');
  reviewName = signal('');
  reviewEmail = signal('');
  isSubmittingReview = signal(false);
  reviewSuccessMessage = signal<string | null>(null);
  reviewErrorMessage = signal<string | null>(null);

  orderNumberInput = signal('');
  contactInput = signal('');
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  order = signal<Order | null>(null);

  readonly steps = [
    { key: 'PLACED', label: 'Order Placed', desc: 'Received & confirmed' },
    { key: 'PACKED', label: 'Crafting & Packed', desc: 'Handcrafted & inspected' },
    { key: 'SHIPPED', label: 'Dispatched', desc: 'On courier route' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Arrived at your door' },
  ];

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const ordNum = params.get('orderNumber');
      const contact = params.get('contact');

      if (ordNum) {
        this.orderNumberInput.set(ordNum);
      }
      if (contact) {
        this.contactInput.set(contact);
      }

      if (ordNum && contact) {
        this.onTrack();
      }
    });
  }

  onTrack(): void {
    const num = this.orderNumberInput().trim();
    const contact = this.contactInput().trim();

    if (!num || !contact) {
      this.errorMessage.set('Please provide both Order Number and your Email or Phone.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.orderService.trackOrder(num, contact).subscribe({
      next: (data) => {
        this.order.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.order.set(null);
        this.errorMessage.set(
          err.error?.message || 'No order found matching this order number and contact information. Please verify your details.'
        );
      },
    });
  }

  isStepCompleted(status: OrderStatus, stepKey: string): boolean {
    const statusWeight: Record<OrderStatus, number> = {
      PLACED: 1,
      PACKED: 2,
      SHIPPED: 3,
      DELIVERED: 4,
      CANCELLED: 0,
    };
    const currentWeight = statusWeight[status] || 0;
    const targetWeight = statusWeight[stepKey as OrderStatus] || 0;
    return currentWeight >= targetWeight && status !== 'CANCELLED';
  }

  isCurrentStep(status: OrderStatus, stepKey: string): boolean {
    return status === stepKey && status !== 'CANCELLED';
  }

  getStatusLabel(status: OrderStatus): string {
    switch (status) {
      case 'PLACED': return 'Order Placed';
      case 'PACKED': return 'Crafted & Packed';
      case 'SHIPPED': return 'On Courier Route';
      case 'DELIVERED': return 'Delivered';
      case 'CANCELLED': return 'Cancelled';
      default: return status;
    }
  }

  getGeneralWhatsApp(order: Order): string {
    const msg = `Hi LeeCraft, I would like to check the status of my order #${order.id} (${order.fullName}).`;
    return `https://wa.me/94771234567?text=${encodeURIComponent(msg)}`;
  }

  openItemReviewModal(order: Order, item: any): void {
    this.reviewingOrder.set(order);
    this.reviewingItem.set(item);
    this.isStoreReview.set(false);
    this.reviewRating.set(5);
    this.reviewComment.set('');
    this.reviewName.set(order.fullName || '');
    this.reviewEmail.set(order.email || '');
    this.reviewSuccessMessage.set(null);
    this.reviewErrorMessage.set(null);
    this.showReviewModal.set(true);
  }

  openStoreReviewModal(order: Order): void {
    this.reviewingOrder.set(order);
    this.reviewingItem.set(null);
    this.isStoreReview.set(true);
    this.reviewRating.set(5);
    this.reviewComment.set('');
    this.reviewName.set(order.fullName || '');
    this.reviewEmail.set(order.email || '');
    this.reviewSuccessMessage.set(null);
    this.reviewErrorMessage.set(null);
    this.showReviewModal.set(true);
  }

  closeReviewModal(): void {
    this.showReviewModal.set(false);
    this.reviewingOrder.set(null);
    this.reviewingItem.set(null);
  }

  getRatingText(rating: number): string {
    switch (rating) {
      case 5: return '5 of 5 Stars — Exceptional Masterpiece!';
      case 4: return '4 of 5 Stars — Very Good Quality!';
      case 3: return '3 of 5 Stars — Average Experience';
      case 2: return '2 of 5 Stars — Needs Improvement';
      case 1: return '1 of 5 Stars — Dissatisfied';
      default: return `${rating} of 5 Stars`;
    }
  }

  isItemReviewed(orderId: string | number, productId: string | number): boolean {
    return this.reviewedItems().has(`${orderId}-${productId}`);
  }

  submitReview(): void {
    if (!this.reviewComment().trim() || !this.reviewName().trim()) return;

    this.isSubmittingReview.set(true);
    this.reviewErrorMessage.set(null);

    const item = this.reviewingItem();
    const order = this.reviewingOrder();
    const prodIdNum = item ? Number(item.productId) : null;

    const req: CreateReviewRequest = {
      productId: prodIdNum && !isNaN(prodIdNum) && prodIdNum > 0 ? prodIdNum : null,
      reviewerName: this.reviewName().trim(),
      reviewerEmail: this.reviewEmail().trim() || undefined,
      rating: this.reviewRating(),
      comment: this.reviewComment().trim(),
      orderId: order ? order.id : null,
    };

    this.productService.submitReview(req).subscribe({
      next: () => {
        this.isSubmittingReview.set(false);
        this.reviewSuccessMessage.set(
          this.isStoreReview()
            ? 'Thank you for reviewing your LeeCraft shopping experience!'
            : `Thank you! Your verified review for "${item?.productName}" has been posted.`
        );
        if (order && item) {
          const key = `${order.id}-${item.productId}`;
          this.reviewedItems.update((set) => new Set(set).add(key));
        }
        setTimeout(() => {
          this.closeReviewModal();
        }, 1800);
      },
      error: (err) => {
        this.isSubmittingReview.set(false);
        this.reviewErrorMessage.set(err.error?.message || 'Failed to submit review. Please try again.');
      },
    });
  }
}
