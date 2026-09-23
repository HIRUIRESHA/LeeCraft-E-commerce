import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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

type Tab = 'profile' | 'addresses' | 'security' | 'orders';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DecimalPipe, DatePipe, RouterLink],
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
                              <div class="item-row">
                                <span class="item-name"><strong>{{ item.productName }}</strong> &times; {{ item.qty }}</span>
                                <span class="item-total">Rs. {{ item.lineTotal | number }}</span>
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
    }
    .whatsapp-link-btn {
      font-size: 12.5px;
      color: #16a34a;
      text-decoration: none;
      font-weight: 600;
    }
    .whatsapp-link-btn:hover { text-decoration: underline; }
  `],
})
export class AccountComponent implements OnInit {
  public auth = inject(AuthService);
  private profileService = inject(ProfileService);
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  activeTab: Tab = 'orders';
  profile: UserProfile | null = null;
  addresses: UserAddress[] = [];
  orders: Order[] = [];
  isLoadingOrders = false;

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