import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {
  AddressRequest,
  ProfileService,
  UserAddress,
  UserProfile,
} from '../../core/services/profile.service';
import { OrderService } from '../../core/services/order.service';
import { Order, OrderStatus } from '../../core/models/order.model';
import { ProductService } from '../../core/services/product.service';
import { CreateReviewRequest } from '../../core/models/product.model';

type Tab = 'profile' | 'addresses' | 'security' | 'orders';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DecimalPipe, DatePipe, RouterLink],
  template: `
    <div class="wrap section">

      <div class="eyebrow">Account</div>

      <h1
        class="serif"
        style="font-size:32px;font-weight:500;margin:10px 0 30px;"
      >
        My Account
      </h1>

      <div class="acc-layout">

        <!-- Navigation Sidebar -->
        <nav class="acc-nav">
          <a
            [class.active]="activeTab === 'orders'"
            (click)="activeTab = 'orders'"
          >
            My Orders
            @if (orders.length > 0) {
              <span class="tab-badge">{{ orders.length }}</span>
            }
          </a>

          <a
            [class.active]="activeTab === 'profile'"
            (click)="activeTab = 'profile'"
          >
            Profile Information
          </a>

          <a
            [class.active]="activeTab === 'addresses'"
            (click)="activeTab = 'addresses'"
          >
            Delivery Addresses
          </a>

          <a
            [class.active]="activeTab === 'security'"
            (click)="activeTab = 'security'"
          >
            Password & Security
          </a>

          <a (click)="logout()" style="color:var(--danger);margin-top:20px;">
            Log Out
          </a>
        </nav>

        <!-- Tab Content -->
        <div style="min-width:0;">

          <!-- Global alert messages -->
          @if (feedbackMessage) {
            <div style="
              background:#E6EFE6;
              color:var(--ok);
              border:1px solid #c3dec3;
              padding:12px 16px;
              border-radius:4px;
              margin-bottom:20px;
              font-size:13.5px;
            ">
              {{ feedbackMessage }}
            </div>
          }

          @if (errorMessage) {
            <div style="
              background:#FBEAE8;
              color:var(--danger);
              border:1px solid #f0c3be;
              padding:12px 16px;
              border-radius:4px;
              margin-bottom:20px;
              font-size:13.5px;
            ">
              {{ errorMessage }}
            </div>
          }

          <!-- TAB 0: MY ORDERS -->
          @if (activeTab === 'orders') {
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
                <div>
                  <h2 class="serif" style="font-size:24px;margin:0;">Order History</h2>
                  <p style="color:var(--wood-600);font-size:13px;margin:4px 0 0;">View your past orders, items, and live tracking status.</p>
                </div>
                <a routerLink="/track-order" class="btn btn-outline btn-sm">
                  🔍 Track Any Order
                </a>
              </div>

              @if (isLoadingOrders) {
                <div style="text-align:center;padding:50px 0;color:var(--wood-600);font-size:14px;">
                  Loading your orders...
                </div>
              } @else if (orders.length === 0) {
                <div class="empty-orders-card">
                  <div style="font-size:42px;margin-bottom:12px;">📦</div>
                  <h3 style="font-size:18px;margin-bottom:8px;font-weight:600;">No orders found yet</h3>
                  <p style="color:var(--wood-600);font-size:13.5px;max-width:380px;margin:0 auto 20px;line-height:1.5;">
                    You haven't placed any orders with this account yet. Discover our collection of handcrafted cutting boards and wooden crafts!
                  </p>
                  <a routerLink="/shop" class="btn btn-primary btn-sm">Browse Crafts</a>
                </div>
              } @else {
                <div class="orders-list">
                  @for (order of orders; track order.id) {
                    <div class="account-order-card">
                      <!-- Header -->
                      <div class="account-order-header">
                        <div>
                          <div class="order-id-badge">Order #{{ order.id }}</div>
                          <div class="order-time-text">Placed on {{ order.createdAt | date:'mediumDate' }}</div>
                        </div>
                        <span class="status-chip" [ngClass]="'status-' + order.status.toLowerCase()">
                          {{ getStatusLabel(order.status) }}
                        </span>
                      </div>

                      <!-- Items breakdown -->
                      <div class="account-order-body">
                        @if (order.items && order.items.length > 0) {
                          <div class="items-table">
                            @for (item of order.items; track item.productId) {
                              <div class="item-row item-with-review">
                                <div class="item-info-col">
                                  <span class="item-name"><strong>{{ item.productName }}</strong> &times; {{ item.qty }}</span>
                                  <span class="item-total">Rs. {{ item.lineTotal | number }}</span>
                                </div>
                                <div class="item-review-col">
                                  @if (order.status === 'DELIVERED') {
                                    <button
                                      type="button"
                                      class="btn-review-item"
                                      [class.reviewed]="isItemReviewed(order.id, item.productId)"
                                      (click)="openItemReviewModal(order, item)"
                                    >
                                      {{ isItemReviewed(order.id, item.productId) ? '✓ Reviewed' : '★ Review Item' }}
                                    </button>
                                  } @else {
                                    <span class="review-locked-hint">Review available after delivery</span>
                                  }
                                </div>
                              </div>
                            }
                          </div>
                        }

                        <div class="order-meta-grid">
                          <div class="shipping-info">
                            <span class="sub-label">Shipping Destination:</span>
                            <span class="sub-val">{{ order.address }}, {{ order.city }}</span>
                            <span class="sub-label" style="margin-top:6px;">Delivery Method:</span>
                            <span class="sub-val">{{ order.shippingMethod === 'EXPRESS' ? 'Express Delivery' : 'Standard Delivery' }}</span>
                          </div>

                          <div class="price-info">
                            @if (order.discountAmount && order.discountAmount > 0) {
                              <div style="font-size:12.5px;color:#16a34a;margin-bottom:2px;">
                                Discount ({{ order.promoCode }}): - Rs. {{ order.discountAmount | number }}
                              </div>
                            }
                            <div style="font-size:12.5px;color:var(--wood-600);margin-bottom:4px;">
                              Shipping: Rs. {{ (order.shippingCost || 0) | number }}
                            </div>
                            <div class="final-total">
                              Total: Rs. {{ order.total | number }}
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Card Actions -->
                      <div class="account-order-footer">
                        <a
                          [routerLink]="['/track-order']"
                          [queryParams]="{ orderNumber: order.id, contact: order.email || order.contactNumber }"
                          class="btn btn-outline btn-sm"
                        >
                          🚚 Live Tracking
                        </a>
                        @if (order.status === 'DELIVERED') {
                          <button
                            type="button"
                            class="btn-store-review"
                            (click)="openStoreReviewModal(order)"
                          >
                            💬 Review Store Experience
                          </button>
                        }
                        @if (order.whatsappLink) {
                          <a
                            [href]="order.whatsappLink"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="whatsapp-link-btn"
                          >
                            💬 WhatsApp Support
                          </a>
                        }
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          }

          <!-- TAB 1: PROFILE INFORMATION -->
          @if (activeTab === 'profile') {
            <div style="max-width:480px;">
              <h2 class="serif" style="font-size:22px;margin-bottom:20px;">Personal Details</h2>

              <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">

                <div class="field">
                  <label>Full Name</label>
                  <input type="text" formControlName="fullName" />
                </div>

                <div class="field">
                  <label>Email Address</label>
                  <input type="email" [value]="profile?.email" disabled style="background:var(--cream-2);opacity:.8;" />
                  <small style="color:var(--wood-400);font-size:11.5px;margin-top:4px;display:block;">
                    Email address cannot be changed. (Verified account)
                  </small>
                </div>

                <div class="field">
                  <label>Phone Number</label>
                  <input type="tel" formControlName="phone" placeholder="07XXXXXXXX" />
                </div>

                <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="profileForm.invalid || isSavingProfile"
                  style="margin-top:10px;"
                >
                  {{ isSavingProfile ? 'Saving...' : 'Save Profile' }}
                </button>

              </form>
            </div>
          }

          <!-- TAB 2: SAVED ADDRESSES -->
          @if (activeTab === 'addresses') {
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <h2 class="serif" style="font-size:22px;margin:0;">Saved Delivery Addresses</h2>
                <button
                  type="button"
                  class="btn btn-outline btn-sm"
                  (click)="showAddressForm = !showAddressForm"
                >
                  {{ showAddressForm ? 'Cancel' : '+ Add Address' }}
                </button>
              </div>

              <!-- New Address Form Modal/Section -->
              @if (showAddressForm) {
                <div style="
                  background:#fff;
                  border:1px solid var(--line);
                  padding:24px;
                  border-radius:4px;
                  margin-bottom:30px;
                  max-width:540px;
                ">
                  <h3 style="margin-top:0;margin-bottom:16px;font-size:16px;">Add New Delivery Address</h3>

                  <form [formGroup]="addressForm" (ngSubmit)="saveAddress()">
                    <div class="field">
                      <label>Recipient Name</label>
                      <input type="text" formControlName="recipientName" placeholder="Full name of receiver" />
                    </div>

                    <div class="field">
                      <label>Phone Number</label>
                      <input type="tel" formControlName="phone" placeholder="07XXXXXXXX" />
                    </div>

                    <div class="field">
                      <label>Street Address</label>
                      <input type="text" formControlName="streetAddress" placeholder="Apartment, suite, street" />
                    </div>

                    <div class="form-row">
                      <div class="field">
                        <label>City</label>
                        <input type="text" formControlName="city" placeholder="Colombo" />
                      </div>

                      <div class="field">
                        <label>Postal Code</label>
                        <input type="text" formControlName="postalCode" placeholder="00100" />
                      </div>
                    </div>

                    <div style="margin:14px 0 20px;display:flex;align-items:center;gap:8px;font-size:13.5px;">
                      <input type="checkbox" id="defAddr" formControlName="isDefault" style="cursor:pointer;" />
                      <label for="defAddr" style="cursor:pointer;user-select:none;">Set as default delivery address</label>
                    </div>

                    <button
                      type="submit"
                      class="btn btn-primary btn-sm"
                      [disabled]="addressForm.invalid || isSavingAddress"
                    >
                      {{ isSavingAddress ? 'Saving Address...' : 'Save Address' }}
                    </button>
                  </form>
                </div>
              }

              <!-- Address Cards Grid -->
              @if (addresses.length === 0 && !showAddressForm) {
                <p style="color:var(--wood-700);font-size:14px;">
                  No delivery addresses saved yet. Click <strong>+ Add Address</strong> to save one for faster checkout.
                </p>
              }

              <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;">
                @for (addr of addresses; track addr.id) {
                  <div style="
                    background:#fff;
                    border:1px solid var(--line);
                    padding:20px;
                    border-radius:4px;
                    position:relative;
                  ">
                    @if (addr.isDefault) {
                      <span class="status-chip" style="position:absolute;top:16px;right:16px;">
                        Default
                      </span>
                    }

                    <div style="font-weight:600;font-size:15px;margin-bottom:6px;">
                      {{ addr.recipientName }}
                    </div>

                    <div style="font-size:13.5px;color:var(--wood-700);line-height:1.5;">
                      <div>{{ addr.streetAddress }}</div>
                      <div>{{ addr.city }}{{ addr.postalCode ? ', ' + addr.postalCode : '' }}</div>
                      <div style="margin-top:6px;font-size:13px;color:var(--wood-500);">
                        Phone: {{ addr.phone }}
                      </div>
                    </div>

                    <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--line);display:flex;justify-content:flex-end;">
                      <button
                        type="button"
                        style="background:none;border:none;color:var(--danger);font-size:12px;cursor:pointer;"
                        (click)="deleteAddress(addr.id)"
                      >
                        Delete Address
                      </button>
                    </div>
                  </div>
                }
              </div>

            </div>
          }

          <!-- TAB 3: PASSWORD & SECURITY -->
          @if (activeTab === 'security') {
            <div style="max-width:440px;">
              <h2 class="serif" style="font-size:22px;margin-bottom:20px;">Change Password</h2>

              <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">

                <div class="field">
  <label>Current Password</label>

  <div style="display:flex;gap:8px;">
    <input
      [type]="showCurrentPassword ? 'text' : 'password'"
      formControlName="currentPassword"
      style="flex:1;"
    />

    <button
      type="button"
      class="btn btn-outline btn-sm"
      (click)="showCurrentPassword = !showCurrentPassword"
    >
      {{ showCurrentPassword ? 'Hide' : 'Show' }}
    </button>
  </div>
</div>

<div class="field">
  <label>New Password</label>

  <div style="display:flex;gap:8px;">
    <input
      [type]="showNewPassword ? 'text' : 'password'"
      formControlName="newPassword"
      placeholder="Minimum 8 characters"
      style="flex:1;"
    />

    <button
      type="button"
      class="btn btn-outline btn-sm"
      (click)="showNewPassword = !showNewPassword"
    >
      {{ showNewPassword ? 'Hide' : 'Show' }}
    </button>
  </div>
</div>

<div class="field">
  <label>Confirm New Password</label>

  <div style="display:flex;gap:8px;">
    <input
      [type]="showConfirmPassword ? 'text' : 'password'"
      formControlName="confirmPassword"
      placeholder="Confirm your new password"
      style="flex:1;"
    />

    <button
      type="button"
      class="btn btn-outline btn-sm"
      (click)="showConfirmPassword = !showConfirmPassword"
    >
      {{ showConfirmPassword ? 'Hide' : 'Show' }}
    </button>
  </div>
</div>

                <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="passwordForm.invalid || isChangingPassword"
                  style="margin-top:10px;"
                >
                  {{ isChangingPassword ? 'Updating Password...' : 'Update Password' }}
                </button>

              </form>
            </div>
          }

        </div>

      </div>

    </div>

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
                {{ isStoreReview() ? 'Share your feedback on LeeCraft service, delivery, and craftsmanship' : 'Your review helps fellow craft lovers and our local artisans' }}
              </span>
            </div>
            <button type="button" class="modal-close-btn" (click)="closeReviewModal()">&times;</button>
          </div>

          <!-- Reviewed Subject Card -->
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

            <!-- Customer Information (Auto-filled) -->
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

            <!-- Feedback / Comment -->
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
  `,
  styles: [`
    .tab-badge {
      background: var(--wood-500);
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      padding: 1px 7px;
      border-radius: 999px;
      margin-left: 6px;
    }
    .empty-orders-card {
      text-align: center;
      padding: 48px 24px;
      background: #fff;
      border: 1px dashed var(--line);
      border-radius: 8px;
    }
    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .account-order-card {
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.02);
    }
    .account-order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: #faf8f5;
      border-bottom: 1px solid var(--line);
    }
    .order-id-badge {
      font-weight: 700;
      font-size: 15px;
      color: var(--wood-900);
    }
    .order-time-text {
      font-size: 12px;
      color: var(--wood-500);
      margin-top: 2px;
    }
    .status-chip {
      display: inline-block;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 4px;
      text-transform: capitalize;
    }
    .status-placed { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
    .status-packed { background: #fefce8; color: #a16207; border: 1px solid #fef08a; }
    .status-shipped { background: #faf5ff; color: #7e22ce; border: 1px solid #e9d5ff; }
    .status-delivered { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
    .status-cancelled { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }

    .account-order-body {
      padding: 20px;
    }
    .items-table {
      border-bottom: 1px solid var(--line);
      padding-bottom: 12px;
      margin-bottom: 14px;
    }
    .item-row {
      display: flex;
      justify-content: space-between;
      font-size: 13.5px;
      margin-bottom: 8px;
    }
    .item-name { color: var(--wood-900); }
    .item-total { font-weight: 500; color: var(--wood-800); }

    .order-meta-grid {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      font-size: 13px;
    }
    .sub-label { display: block; color: var(--wood-500); font-size: 11.5px; text-transform: uppercase; font-weight: 600; }
    .sub-val { color: var(--wood-800); }
    .final-total { font-size: 16px; font-weight: 700; color: var(--wood-900); margin-top: 4px; }

    .account-order-footer {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      background: #faf8f5;
      border-top: 1px solid var(--line);
      flex-wrap: wrap;
    }
    .item-with-review {
      align-items: center;
      padding: 6px 0;
      border-bottom: 1px dashed #f0ede8;
    }
    .item-with-review:last-child {
      border-bottom: none;
    }
    .item-info-col {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .btn-review-item {
      background: #fff;
      color: var(--wood-900);
      border: 1px solid var(--wood-700);
      padding: 5px 12px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .btn-review-item:hover {
      background: var(--wood-900);
      color: #fff;
    }
    .btn-review-item.reviewed {
      background: #f0fdf4;
      color: #166534;
      border-color: #bbf7d0;
      cursor: default;
    }
    .review-locked-hint {
      font-size: 11.5px;
      color: var(--wood-400);
      font-style: italic;
    }
    .btn-store-review {
      background: #fefce8;
      color: #854d0e;
      border: 1px solid #fde047;
      padding: 5px 12px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-store-review:hover {
      background: #fef08a;
    }
    .whatsapp-link-btn {
      font-size: 12.5px;
      color: #16a34a;
      text-decoration: none;
      font-weight: 600;
    }
    .whatsapp-link-btn:hover { text-decoration: underline; }

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
    .target-icon {
      font-size: 24px;
    }
    .target-title {
      font-weight: 600;
      color: var(--wood-900);
      font-size: 14px;
    }
    .target-meta {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-top: 2px;
      font-size: 12px;
    }
    .order-ref {
      color: var(--wood-600);
    }
    .item-bought-detail {
      background: #f3eee7;
      color: var(--wood-800);
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
    }
    .verified-tag {
      color: #16a34a;
      font-weight: 600;
    }
    .star-rating-selector {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 6px;
    }
    .star-btn {
      background: none;
      border: none;
      font-size: 26px;
      color: #d1c7bc;
      cursor: pointer;
      padding: 0 2px;
      transition: color 0.15s;
    }
    .star-btn.active {
      color: #d97706;
    }
    .rating-text-label {
      font-size: 12px;
      color: var(--wood-700);
      margin-left: 8px;
      font-weight: 500;
    }
    .review-modal-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .modal-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .modal-field label {
      font-size: 12.5px;
      font-weight: 600;
      color: var(--wood-800);
    }
    .modal-field input, .modal-field textarea {
      padding: 9px 12px;
      border: 1px solid var(--line);
      border-radius: 5px;
      font-size: 13.5px;
      font-family: inherit;
    }
    .modal-field input:focus, .modal-field textarea:focus {
      outline: none;
      border-color: var(--wood-800);
    }
    .field-hint {
      font-size: 11px;
      color: var(--wood-500);
    }
    .form-row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
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
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 10px;
    }
  `],
})
export class AccountComponent implements OnInit {
  public auth = inject(AuthService);
  private profileService = inject(ProfileService);
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  activeTab: Tab = 'orders';
  profile: UserProfile | null = null;
  addresses: UserAddress[] = [];
  orders: Order[] = [];
  isLoadingOrders = false;

  // Post-delivery review modal state
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

  feedbackMessage: string | null = null;
  errorMessage: string | null = null;

  isSavingProfile = false;
  isSavingAddress = false;
  isChangingPassword = false;
  showAddressForm = false;

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  profileForm = this.fb.group({
    fullName: ['', Validators.required],
    phone: [
      '',
      [Validators.required, Validators.pattern(/^(?:\+94|0)7\d{8}$/)],
    ],
  });

  addressForm = this.fb.group({
    recipientName: ['', Validators.required],
    phone: [
      '',
      [Validators.required, Validators.pattern(/^(?:\+94|0)7\d{8}$/)],
    ],
    streetAddress: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: [''],
    isDefault: [false],
  });

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });

  ngOnInit(): void {
    const tabParam = this.route.snapshot.queryParamMap.get('tab');
    if (tabParam === 'orders' || tabParam === 'addresses' || tabParam === 'security' || tabParam === 'profile') {
      this.activeTab = tabParam as Tab;
    }
    this.loadOrders();
    this.loadProfile();
    this.loadAddresses();
  }

  loadOrders(): void {
    this.isLoadingOrders = true;
    this.orderService.getMyOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoadingOrders = false;
      },
      error: (err) => {
        console.warn('Could not load user orders:', err);
        this.isLoadingOrders = false;
      },
    });
  }

  getStatusLabel(status: OrderStatus): string {
    switch (status) {
      case 'PLACED': return 'Order Placed';
      case 'PACKED': return 'Crafted & Packed';
      case 'SHIPPED': return 'Dispatched';
      case 'DELIVERED': return 'Delivered';
      case 'CANCELLED': return 'Cancelled';
      default: return status;
    }
  }

  openItemReviewModal(order: Order, item: any): void {
    this.reviewingOrder.set(order);
    this.reviewingItem.set(item);
    this.isStoreReview.set(false);
    this.reviewRating.set(5);
    this.reviewComment.set('');
    this.reviewName.set(this.profile?.fullName || order.fullName || this.auth.user()?.fullName || '');
    this.reviewEmail.set(this.profile?.email || order.email || this.auth.user()?.email || '');
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
    this.reviewName.set(this.profile?.fullName || order.fullName || this.auth.user()?.fullName || '');
    this.reviewEmail.set(this.profile?.email || order.email || this.auth.user()?.email || '');
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

  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.profileForm.patchValue({
          fullName: data.fullName,
          phone: data.phone,
        });
      },
      error: (err) => console.error('Failed to load profile', err),
    });
  }

  loadAddresses(): void {
    this.profileService.getAddresses().subscribe({
      next: (data) => (this.addresses = data),
      error: (err) => console.error('Failed to load addresses', err),
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    this.clearAlerts();
    this.isSavingProfile = true;

    const val = this.profileForm.getRawValue();
    this.profileService
      .updateProfile({
        fullName: val.fullName!,
        phone: val.phone!,
      })
      .subscribe({
        next: (updated) => {
          this.isSavingProfile = false;
          this.profile = updated;
          this.auth.updateCurrentUser({
            id: updated.id,
            fullName: updated.fullName,
            email: updated.email,
          });
          this.feedbackMessage = 'Profile updated successfully!';
        },
        error: (err) => {
          this.isSavingProfile = false;
          this.errorMessage =
            err?.error?.message || 'Failed to update profile.';
        },
      });
  }

  saveAddress(): void {
    if (this.addressForm.invalid) return;

    this.clearAlerts();
    this.isSavingAddress = true;

    const val = this.addressForm.getRawValue();
    const req: AddressRequest = {
      recipientName: val.recipientName!,
      phone: val.phone!,
      streetAddress: val.streetAddress!,
      city: val.city!,
      postalCode: val.postalCode || undefined,
      isDefault: !!val.isDefault,
    };

    this.profileService.addAddress(req).subscribe({
      next: () => {
        this.isSavingAddress = false;
        this.showAddressForm = false;
        this.addressForm.reset({ isDefault: false });
        this.loadAddresses();
        this.feedbackMessage = 'Address added successfully!';
      },
      error: (err) => {
        this.isSavingAddress = false;
        this.errorMessage =
          err?.error?.message || 'Failed to add address.';
      },
    });
  }

  deleteAddress(id: number): void {
    if (!confirm('Are you sure you want to delete this address?')) return;

    this.clearAlerts();
    this.profileService.deleteAddress(id).subscribe({
      next: () => {
        this.loadAddresses();
        this.feedbackMessage = 'Address deleted successfully.';
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.message || 'Failed to delete address.';
      },
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;

    const { currentPassword, newPassword, confirmPassword } =
      this.passwordForm.getRawValue();

    if (newPassword !== confirmPassword) {
      this.errorMessage = 'New passwords do not match.';
      return;
    }

    this.clearAlerts();
    this.isChangingPassword = true;

    this.profileService
      .changePassword({
        currentPassword: currentPassword!,
        newPassword: newPassword!,
      })
      .subscribe({
        next: (msg) => {
          this.isChangingPassword = false;
          this.passwordForm.reset();
          this.feedbackMessage = msg || 'Password updated successfully!';
        },
        error: (err) => {
          this.isChangingPassword = false;
          this.errorMessage =
            err?.error?.message ||
            (typeof err?.error === 'string' ? err.error : null) ||
            'Failed to change password. Check your current password.';
        },
      });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/account/login']);
  }

  private clearAlerts(): void {
    this.feedbackMessage = null;
    this.errorMessage = null;
  }
}