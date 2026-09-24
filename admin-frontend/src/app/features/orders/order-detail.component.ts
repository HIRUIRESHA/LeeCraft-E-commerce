import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  Order,
  OrderStatus
} from '../../models/order.model';

import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],

  template: `
    <div class="page">

      <!-- Back -->
      <button
        type="button"
        class="back-button"
        (click)="goBack()"
      >
        <span class="back-icon">←</span>
        Back to Orders
      </button>

      <!-- Loading -->
      @if (loading) {

        <div class="state">
          <div class="spinner"></div>
          <p>Loading order...</p>
        </div>

      }

      <!-- Error -->
      @else if (errorMessage) {

        <div class="error-state">
          <div class="error-icon">!</div>

          <h2>Unable to load order</h2>

          <p>
            {{ errorMessage }}
          </p>

          <button
            type="button"
            class="retry-button"
            (click)="retry()"
          >
            Try Again
          </button>
        </div>

      }

      <!-- Order -->
      @else if (order) {

        <!-- =========================
             HEADER
        ========================== -->

        <div class="header">

          <div class="header-left">

            <div class="eyebrow">
              ORDER DETAILS
            </div>

            <h1>
              {{ order.id }}
            </h1>

            <p class="order-date">
              Placed
              {{ order.createdAt | date:'dd MMMM yyyy, h:mm a' }}
            </p>

          </div>

          <!-- STATUS -->
          <div class="status-section">

            <div
              class="status-badge"
              [ngClass]="getStatusClass(order.status)"
            >
              <span class="status-dot"></span>
              {{ getStatusLabel(order.status) }}
            </div>

            <div class="status-update">

              <label for="orderStatus">
                Update Status
              </label>

              <div class="status-actions">

                <select
                  id="orderStatus"
                  [value]="selectedStatus"
                  (change)="onStatusSelect($event)"
                  [disabled]="updatingStatus"
                >

                  @for (
                    status of statuses;
                    track status
                  ) {

                    <option [value]="status">
                      {{ getStatusLabel(status) }}
                    </option>

                  }

                </select>

                <button
                  type="button"
                  class="update-button"
                  [disabled]="
                    updatingStatus ||
                    selectedStatus === order.status
                  "
                  (click)="updateStatus()"
                >

                  @if (updatingStatus) {
                    Updating...
                  } @else {
                    Update Status
                  }

                </button>

              </div>

            </div>

          </div>

        </div>

        <!-- Success message -->
        @if (successMessage) {

          <div class="success-message">
            <span>✓</span>
            {{ successMessage }}
          </div>

        }

        <!-- =========================
             CUSTOMER + DELIVERY
        ========================== -->

        <div class="two-column">

          <!-- Customer -->
          <section class="card">

            <div class="card-header">

              <div class="card-icon">
                👤
              </div>

              <div>
                <h2>Customer Information</h2>
                <p>Customer contact details</p>
              </div>

            </div>

            <div class="info-list">

              <div class="info-row">

                <span class="info-label">
                  Name
                </span>

                <strong>
                  {{ order.fullName }}
                </strong>

              </div>

              <div class="info-row">

                <span class="info-label">
                  Email
                </span>

                <strong>
                  {{ order.email }}
                </strong>

              </div>

              <div class="info-row">

                <span class="info-label">
                  Contact Number
                </span>

                <strong>
                  {{ order.contactNumber }}
                </strong>

              </div>

              <div class="info-row">

                <span class="info-label">
                  Preferred Contact
                </span>

                <strong>
                  {{ getContactMethodLabel(order.contactPreference) }}
                </strong>

              </div>

            </div>

            @if (order.whatsappLink) {

              <a
                class="whatsapp-link"
                [href]="order.whatsappLink"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>💬</span>
                Contact via WhatsApp
                <span>↗</span>
              </a>

            }

          </section>

          <!-- Delivery -->
          <section class="card">

            <div class="card-header">

              <div class="card-icon">
                📦
              </div>

              <div>
                <h2>Delivery Information</h2>
                <p>Shipping and delivery details</p>
              </div>

            </div>

            <div class="info-list">

              <div class="info-row">

                <span class="info-label">
                  Address
                </span>

                <strong>
                  {{ order.address }}
                </strong>

              </div>

              <div class="info-row">

                <span class="info-label">
                  City
                </span>

                <strong>
                  {{ order.city }}
                </strong>

              </div>

              <div class="info-row">

                <span class="info-label">
                  Postal Code
                </span>

                <strong>
                  {{ order.postalCode }}
                </strong>

              </div>

              <div class="info-row">

                <span class="info-label">
                  Shipping Method
                </span>

                <strong>
                  {{ getShippingMethodLabel(order.shippingMethod) }}
                </strong>

              </div>

            </div>

          </section>

        </div>

        <!-- =========================
             ORDER ITEMS
        ========================== -->

        <section class="card">

          <div class="card-header">

            <div class="card-icon">
              🛒
            </div>

            <div>
              <h2>Order Items</h2>
              <p>
                {{ order.items.length }}
                {{ order.items.length === 1 ? 'item' : 'items' }}
              </p>
            </div>

          </div>

          <!-- Desktop table -->
          <div class="items-table">

            <div class="items-header">

              <span>Product</span>
              <span>Quantity</span>
              <span>Unit Price</span>
              <span>Total</span>

            </div>

            @for (
              item of order.items;
              track item.productId
            ) {

              <div class="item-row">

                <div class="item-info">

                  <strong>
                    {{ item.productName }}
                  </strong>

                  <span>
                    Product ID:
                    {{ item.productId }}
                  </span>

                </div>

                <div class="item-quantity">
                  × {{ item.qty }}
                </div>

                <div class="item-price">
                  Rs.
                  {{ item.unitPrice | number:'1.0-2' }}
                </div>

                <strong class="item-total">
                  Rs.
                  {{ item.lineTotal | number:'1.0-2' }}
                </strong>

              </div>

            }

          </div>

        </section>

        <!-- =========================
             ORDER SUMMARY
        ========================== -->

        <section class="summary-card">

          <div class="summary-content">

            <div class="summary-row">

              <span>Subtotal</span>

              <strong>
                Rs.
                {{ order.subtotal | number:'1.0-2' }}
              </strong>

            </div>

            @if (order.discountAmount > 0) {

              <div class="summary-row discount">

                <span>
                  Discount

                  @if (order.promoCode) {
                    <small>
                      ({{ order.promoCode }})
                    </small>
                  }
                </span>

                <strong>
                  - Rs.
                  {{ order.discountAmount | number:'1.0-2' }}
                </strong>

              </div>

            }

            <div class="summary-row">

              <span>
                Shipping
              </span>

              <strong>
                Rs.
                {{ order.shippingCost | number:'1.0-2' }}
              </strong>

            </div>

            <div class="summary-divider"></div>

            <div class="summary-row grand-total">

              <span>
                Total
              </span>

              <strong>
                Rs.
                {{ order.total | number:'1.0-2' }}
              </strong>

            </div>

          </div>

        </section>

      }

    </div>
  `,

  styles: [`

    /* =========================================
       PAGE
    ========================================= */

    .page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px;
      color: #3b2a20;
    }

    /* =========================================
       BACK BUTTON
    ========================================= */

    .back-button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: 0;
      background: transparent;
      color: #6f5845;
      padding: 6px 0;
      margin-bottom: 28px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      transition: color .2s ease;
    }

    .back-button:hover {
      color: #8a4b2e;
    }

    .back-icon {
      font-size: 18px;
    }

    /* =========================================
       HEADER
    ========================================= */

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 30px;
      margin-bottom: 28px;
    }

    .eyebrow {
      color: #a9764f;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.8px;
      text-transform: uppercase;
    }

    h1 {
      margin: 6px 0 5px;
      color: #3b2a20;
      font-size: 32px;
      font-weight: 600;
      letter-spacing: -.4px;
    }

    .order-date {
      margin: 0;
      color: #927d6c;
      font-size: 13px;
    }

    /* =========================================
       STATUS
    ========================================= */

    .status-section {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 13px;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 7px 12px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: .3px;
    }

    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      display: inline-block;
    }

    .status-placed {
      background: #fff4d6;
      color: #8a5a00;
    }

    .status-placed .status-dot {
      background: #d89b00;
    }

    .status-packed {
      background: #e8f1ff;
      color: #245b9e;
    }

    .status-packed .status-dot {
      background: #3978c6;
    }

    .status-shipped {
      background: #eceaff;
      color: #574da1;
    }

    .status-shipped .status-dot {
      background: #6c63c4;
    }

    .status-delivered {
      background: #e7f7eb;
      color: #27743b;
    }

    .status-delivered .status-dot {
      background: #35a853;
    }

    .status-cancelled {
      background: #fdeaea;
      color: #a33a3a;
    }

    .status-cancelled .status-dot {
      background: #d64545;
    }

    .status-update {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .status-update label {
      color: #806b59;
      font-size: 11px;
      font-weight: 600;
    }

    .status-actions {
      display: flex;
      gap: 8px;
    }

    .status-actions select {
      min-width: 145px;
      padding: 9px 12px;
      border: 1px solid #ded2c5;
      border-radius: 8px;
      background: #fff;
      color: #4b382c;
      font-size: 12px;
      cursor: pointer;
      outline: none;
    }

    .status-actions select:focus {
      border-color: #a9764f;
      box-shadow: 0 0 0 3px rgba(169, 118, 79, .12);
    }

    .update-button {
      padding: 9px 15px;
      border: 0;
      border-radius: 8px;
      background: #8a4b2e;
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: background .2s ease, opacity .2s ease;
    }

    .update-button:hover:not(:disabled) {
      background: #6f3922;
    }

    .update-button:disabled {
      opacity: .45;
      cursor: not-allowed;
    }

    /* =========================================
       SUCCESS
    ========================================= */

    .success-message {
      display: flex;
      align-items: center;
      gap: 9px;
      margin-bottom: 20px;
      padding: 11px 14px;
      border: 1px solid #bce6c5;
      border-radius: 8px;
      background: #f0fbf2;
      color: #26733a;
      font-size: 13px;
      font-weight: 600;
    }

    .success-message span {
      font-size: 16px;
    }

    /* =========================================
       TWO COLUMN
    ========================================= */

    .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    /* =========================================
       CARDS
    ========================================= */

    .card {
      background: #fff;
      border: 1px solid #e8ddd2;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(59, 42, 32, .03);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .card-icon {
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 9px;
      background: #f6eee7;
      font-size: 16px;
    }

    .card-header h2 {
      margin: 0 0 2px;
      color: #3b2a20;
      font-size: 16px;
      font-weight: 700;
    }

    .card-header p {
      margin: 0;
      color: #9a8675;
      font-size: 11px;
    }

    /* =========================================
       INFORMATION
    ========================================= */

    .info-list {
      display: flex;
      flex-direction: column;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      padding: 11px 0;
      border-bottom: 1px solid #f0e9e2;
    }

    .info-row:last-child {
      border-bottom: 0;
    }

    .info-label {
      color: #927d6c;
      font-size: 12px;
      flex-shrink: 0;
    }

    .info-row strong {
      max-width: 65%;
      color: #49372b;
      font-size: 12px;
      font-weight: 600;
      text-align: right;
      word-break: break-word;
    }

    /* =========================================
       WHATSAPP
    ========================================= */

    .whatsapp-link {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      margin-top: 16px;
      padding: 9px 12px;
      border-radius: 7px;
      background: #eef9f1;
      color: #28743d;
      font-size: 12px;
      font-weight: 600;
      text-decoration: none;
      transition: background .2s ease;
    }

    .whatsapp-link:hover {
      background: #ddf3e2;
    }

    /* =========================================
       ITEMS
    ========================================= */

    .items-table {
      width: 100%;
    }

    .items-header,
    .item-row {
      display: grid;
      grid-template-columns: minmax(250px, 1fr) 100px 130px 140px;
      gap: 20px;
      align-items: center;
    }

    .items-header {
      padding: 10px 0;
      border-bottom: 1px solid #ded4ca;
      color: #967f6c;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: .8px;
      text-transform: uppercase;
    }

    .items-header span:nth-child(n+2) {
      text-align: right;
    }

    .item-row {
      padding: 17px 0;
      border-bottom: 1px solid #eee8e2;
    }

    .item-row:last-child {
      border-bottom: 0;
    }

    .item-info {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .item-info strong {
      color: #463429;
      font-size: 13px;
    }

    .item-info span {
      color: #a18d7c;
      font-size: 10px;
    }

    .item-quantity,
    .item-price,
    .item-total {
      color: #574235;
      font-size: 12px;
      text-align: right;
    }

    .item-total {
      font-weight: 700;
    }

    /* =========================================
       SUMMARY
    ========================================= */

    .summary-card {
      width: min(100%, 430px);
      margin-left: auto;
      margin-bottom: 30px;
      padding: 24px;
      background: #fff;
      border: 1px solid #e8ddd2;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(59, 42, 32, .03);
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 30px;
      padding: 9px 0;
      color: #806b59;
      font-size: 13px;
    }

    .summary-row strong {
      color: #4a372b;
      font-weight: 600;
    }

    .summary-row.discount {
      color: #28743d;
    }

    .summary-row.discount strong {
      color: #28743d;
    }

    .summary-row small {
      font-size: 10px;
    }

    .summary-divider {
      height: 1px;
      margin: 10px 0;
      background: #ded4ca;
    }

    .grand-total {
      padding-top: 12px;
      color: #3b2a20;
      font-size: 16px;
      font-weight: 700;
    }

    .grand-total strong {
      color: #8a4b2e;
      font-size: 18px;
    }

    /* =========================================
       LOADING / ERROR
    ========================================= */

    .state,
    .error-state {
      min-height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .state p {
      margin-top: 15px;
      color: #927d6c;
      font-size: 13px;
    }

    .spinner {
      width: 30px;
      height: 30px;
      border: 3px solid #eadfd5;
      border-top-color: #8a4b2e;
      border-radius: 50%;
      animation: spin .8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .error-icon {
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
      border-radius: 50%;
      background: #fdeaea;
      color: #b33d3d;
      font-weight: 700;
    }

    .error-state h2 {
      margin: 0 0 7px;
      color: #4a372b;
      font-size: 18px;
    }

    .error-state p {
      margin: 0 0 18px;
      color: #927d6c;
      font-size: 13px;
    }

    .retry-button {
      padding: 9px 16px;
      border: 0;
      border-radius: 7px;
      background: #8a4b2e;
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .retry-button:hover {
      background: #6f3922;
    }

    /* =========================================
       RESPONSIVE
    ========================================= */

    @media (max-width: 900px) {

      .header {
        flex-direction: column;
      }

      .status-section {
        width: 100%;
        align-items: flex-start;
      }

      .two-column {
        grid-template-columns: 1fr;
      }

    }

    @media (max-width: 700px) {

      .page {
        padding: 18px;
      }

      h1 {
        font-size: 25px;
      }

      .status-actions {
        width: 100%;
        flex-direction: column;
      }

      .status-actions select,
      .update-button {
        width: 100%;
      }

      .items-header {
        display: none;
      }

      .item-row {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 8px 15px;
        padding: 16px 0;
      }

      .item-info {
        grid-column: 1 / -1;
      }

      .item-quantity {
        text-align: left;
      }

      .item-price,
      .item-total {
        text-align: right;
      }

      .summary-card {
        width: 100%;
      }

    }

  `]
})
export class OrderDetailComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly orderService = inject(OrderService);

  order: Order | null = null;

  loading = false;

  updatingStatus = false;

  errorMessage = '';

  successMessage = '';

  selectedStatus: OrderStatus = 'PLACED';

  statuses: OrderStatus[] = [
    'PLACED',
    'PACKED',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
  ];

  ngOnInit(): void {

    const orderNumber =
      this.route.snapshot.paramMap.get('orderNumber');

    if (!orderNumber) {

      this.errorMessage =
        'Order number is missing.';

      return;
    }

    this.loadOrder(orderNumber);
  }

  loadOrder(orderNumber: string): void {

    this.loading = true;

    this.errorMessage = '';

    this.orderService
      .getOrder(orderNumber)
      .subscribe({

        next: (order) => {

          this.order = order;

          this.selectedStatus = order.status;

          this.loading = false;

        },

        error: (error) => {

          console.error(
            'Failed to load order:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to load this order.';

          this.loading = false;
        }

      });
  }

  onStatusSelect(event: Event): void {

    const select =
      event.target as HTMLSelectElement;

    this.selectedStatus =
      select.value as OrderStatus;

    this.successMessage = '';
  }

  updateStatus(): void {

    if (!this.order) {
      return;
    }

    if (this.selectedStatus === this.order.status) {
      return;
    }

    this.updatingStatus = true;

    this.successMessage = '';

    this.orderService
      .updateStatus(
        this.order.id,
        this.selectedStatus
      )
      .subscribe({

        next: (updatedOrder) => {

          this.order = updatedOrder;

          this.selectedStatus =
            updatedOrder.status;

          this.updatingStatus = false;

          this.successMessage =
            `Order status updated to ${this.getStatusLabel(
              updatedOrder.status
            )}.`;

        },

        error: (error) => {

          console.error(
            'Failed to update order status:',
            error
          );

          this.updatingStatus = false;

          this.successMessage = '';

          alert(
            error?.error?.message ||
            'Unable to update order status.'
          );

          // Restore the dropdown to the actual
          // status saved in the database.
          if (this.order) {
            this.selectedStatus =
              this.order.status;
          }

        }

      });
  }

  getStatusClass(status: OrderStatus): string {

    return `status-${status.toLowerCase()}`;
  }

  getStatusLabel(status: OrderStatus): string {

    switch (status) {

      case 'PLACED':
        return 'Placed';

      case 'PACKED':
        return 'Packed';

      case 'SHIPPED':
        return 'Shipped';

      case 'DELIVERED':
        return 'Delivered';

      case 'CANCELLED':
        return 'Cancelled';

      default:
        return status;
    }
  }

  getContactMethodLabel(
    method: Order['contactPreference']
  ): string {

    switch (method) {

      case 'PHONE':
        return 'Phone';

      case 'WHATSAPP':
        return 'WhatsApp';

      case 'EMAIL':
        return 'Email';

      default:
        return method;
    }
  }

  getShippingMethodLabel(
    method: Order['shippingMethod']
  ): string {

    switch (method) {

      case 'STANDARD':
        return 'Standard';

      case 'EXPRESS':
        return 'Express';

      default:
        return method;
    }
  }

  retry(): void {

    const orderNumber =
      this.route.snapshot.paramMap.get('orderNumber');

    if (orderNumber) {
      this.loadOrder(orderNumber);
    }

  }

  goBack(): void {

    // Your app.routes.ts defines:
    // /orders
    // NOT /admin/orders
    this.router.navigate(['/orders']);

  }

}