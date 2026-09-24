import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  inject
} from '@angular/core';
import { Router } from '@angular/router';

import {
  Order,
  OrderStatus
} from '../../models/order.model';

import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],

  template: `
    <div class="page">

      <div class="page-header">

        <div>
          <div class="eyebrow">
            Management
          </div>

          <h1>
            Orders
          </h1>

          <p>
            View and manage customer orders.
          </p>
        </div>

      </div>

      <!-- Filters -->

      <div class="filters">

        <div class="search-wrapper">

          <input
            type="text"
            placeholder="Search order, customer or email..."
            [value]="searchTerm"
            (input)="onSearch($event)"
          />

        </div>

        <select
          [value]="selectedStatus"
          (change)="onStatusChange($event)"
        >

          <option value="">
            All Statuses
          </option>

          @for (
            status of statuses;
            track status
          ) {

            <option [value]="status">
              {{ status }}
            </option>

          }

        </select>

      </div>

      <!-- Loading -->

      @if (loading) {

        <div class="state">
          Loading orders...
        </div>

      }

      <!-- Error -->

      @if (!loading && errorMessage) {

        <div class="error-state">

          <p>
            {{ errorMessage }}
          </p>

          <button
            type="button"
            (click)="loadOrders()"
          >
            Try Again
          </button>

        </div>

      }

      <!-- Empty -->

      @if (
        !loading &&
        !errorMessage &&
        filteredOrders.length === 0
      ) {

        <div class="empty-state">

          <h3>
            No orders found
          </h3>

          <p>
            There are no orders matching your search.
          </p>

        </div>

      }

      <!-- Table -->

      @if (
        !loading &&
        !errorMessage &&
        filteredOrders.length > 0
      ) {

        <div class="table-card">

          <table>

            <thead>

              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              @for (
                order of filteredOrders;
                track order.id
              ) {

                <tr>

                  <!-- Order Number -->

                  <td>

                    <strong>
                      {{ order.id }}
                    </strong>

                  </td>

                  <!-- Customer -->

                  <td>

                    <div class="customer-name">
                      {{ order.fullName }}
                    </div>

                    <div class="customer-email">
                      {{ order.email }}
                    </div>

                  </td>

                  <!-- Date -->

                  <td>

                    {{ order.createdAt | date:'dd MMM yyyy' }}

                  </td>

                  <!-- Items -->

                  <td>

                    {{ order.items.length }}

                  </td>

                  <!-- Total -->

                  <td>

                    <strong>
                      Rs.
                      {{ order.total | number:'1.0-2' }}
                    </strong>

                  </td>

                  <!-- Status -->

                  <td>

                    <span
                      class="status"
                      [class]="getStatusClass(order.status)"
                    >
                      {{ order.status }}
                    </span>

                  </td>

                  <!-- View -->

                  <td>

                    <button
                      type="button"
                      class="view-button"
                      (click)="viewOrder(order.id)"
                    >
                      View
                    </button>

                  </td>

                </tr>

              }

            </tbody>

          </table>

        </div>

        <!-- Pagination -->

        <div class="pagination">

          <button
            type="button"
            [disabled]="currentPage === 0"
            (click)="previousPage()"
          >
            Previous
          </button>

          <span>
            Page {{ currentPage + 1 }}
            of {{ totalPages }}
          </span>

          <button
            type="button"
            [disabled]="
              currentPage >= totalPages - 1
            "
            (click)="nextPage()"
          >
            Next
          </button>

        </div>

      }

    </div>
  `,

  styles: [`

    .page {
      padding: 32px;
    }

    .page-header {
      margin-bottom: 28px;
    }

    .eyebrow {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      opacity: .6;
    }

    h1 {
      margin: 6px 0;
      font-size: 32px;
      font-weight: 500;
    }

    .page-header p {
      margin: 0;
      opacity: .65;
    }

    .filters {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
    }

    .search-wrapper {
      flex: 1;
    }

    .search-wrapper input,
    .filters select {
      width: 100%;
      box-sizing: border-box;
      padding: 11px 14px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: white;
      font-size: 14px;
    }

    .filters select {
      width: 180px;
    }

    .table-card {
      background: white;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 16px;
      text-align: left;
      border-bottom: 1px solid #eee;
      white-space: nowrap;
    }

    th {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .7px;
      opacity: .6;
    }

    .customer-name {
      font-weight: 500;
    }

    .customer-email {
      margin-top: 4px;
      font-size: 12px;
      opacity: .55;
    }

    .status {
      display: inline-block;
      padding: 6px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
    }

    .status-placed {
      background: #fff3cd;
    }

    .status-packed {
      background: #e7f1ff;
    }

    .status-shipped {
      background: #e8e7ff;
    }

    .status-delivered {
      background: #e5f6e9;
    }

    .status-cancelled {
      background: #fde7e7;
    }

    .view-button {
      border: 0;
      background: transparent;
      cursor: pointer;
      font-weight: 600;
      padding: 6px 10px;
    }

    .view-button:hover {
      text-decoration: underline;
    }

    .state,
    .empty-state,
    .error-state {
      padding: 60px 20px;
      text-align: center;
    }

    .error-state {
      color: #a33;
    }

    .error-state button {
      padding: 8px 16px;
      border: 1px solid #ccc;
      border-radius: 7px;
      background: white;
      cursor: pointer;
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      padding: 20px;
    }

    .pagination button {
      padding: 8px 14px;
      border: 1px solid #ddd;
      border-radius: 7px;
      background: white;
      cursor: pointer;
    }

    .pagination button:disabled {
      opacity: .4;
      cursor: not-allowed;
    }

    @media (max-width: 700px) {

      .page {
        padding: 18px;
      }

      .filters {
        flex-direction: column;
      }

      .filters select {
        width: 100%;
      }

    }

  `]
})
export class OrdersComponent implements OnInit {

  private readonly orderService =
    inject(OrderService);

  private readonly router =
    inject(Router);

  orders: Order[] = [];

  filteredOrders: Order[] = [];

  loading = false;

  errorMessage = '';

  searchTerm = '';

  selectedStatus = '';

  currentPage = 0;

  totalPages = 0;

  statuses: OrderStatus[] = [
    'PLACED',
    'PACKED',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
  ];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {

    this.loading = true;
    this.errorMessage = '';

    this.orderService
      .getOrders(
        this.currentPage,
        20,
        this.selectedStatus
          ? this.selectedStatus as OrderStatus
          : undefined
      )
      .subscribe({

        next: (response) => {

          this.orders =
            response.content;

          this.totalPages =
            response.totalPages;

          this.applySearch();

          this.loading = false;
        },

        error: (error) => {

          console.error(
            'Failed to load orders:',
            error
          );

          this.errorMessage =
            'Unable to load orders.';

          this.loading = false;
        }

      });
  }

  onSearch(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.searchTerm =
      input.value;

    this.applySearch();
  }

  applySearch(): void {

    const query =
      this.searchTerm
        .trim()
        .toLowerCase();

    if (!query) {

      this.filteredOrders =
        this.orders;

      return;
    }

    this.filteredOrders =
      this.orders.filter(order =>
        order.id
          .toLowerCase()
          .includes(query) ||

        order.fullName
          .toLowerCase()
          .includes(query) ||

        order.email
          .toLowerCase()
          .includes(query)
      );
  }

  onStatusChange(event: Event): void {

    const select =
      event.target as HTMLSelectElement;

    this.selectedStatus =
      select.value;

    this.currentPage = 0;

    this.loadOrders();
  }

  previousPage(): void {

    if (this.currentPage <= 0) {
      return;
    }

    this.currentPage--;

    this.loadOrders();
  }

  nextPage(): void {

    if (
      this.currentPage >=
      this.totalPages - 1
    ) {
      return;
    }

    this.currentPage++;

    this.loadOrders();
  }

  /**
   * Open the order details page.
   *
   * Backend order number example:
   * LC-12345
   *
   * Angular route:
   * /orders/:orderNumber
   *
   * Result:
   * /orders/LC-12345
   */
  viewOrder(orderNumber: string): void {

    this.router.navigate([
      '/orders',
      orderNumber
    ]);
  }

  getStatusClass(
    status: OrderStatus
  ): string {

    return `status-${status.toLowerCase()}`;
  }
}