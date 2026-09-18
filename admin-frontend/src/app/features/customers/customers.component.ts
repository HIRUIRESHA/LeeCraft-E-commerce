import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AdminCustomer,
  CustomerService,
} from '../../services/customer.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="wrap section">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:16px;">
        <div>
          <div class="eyebrow">Administration</div>
          <h1 class="serif" style="font-size:30px;margin:6px 0 0;">
            Customer Management
          </h1>
        </div>

        <div style="display:flex;gap:12px;align-items:center;">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Search by name or email..."
            style="
              padding: 9px 14px;
              border: 1px solid var(--line);
              border-radius: 4px;
              font-size: 13.5px;
              min-width: 260px;
            "
          />
          <button
            type="button"
            class="btn btn-outline btn-sm"
            (click)="loadCustomers()"
          >
            Refresh
          </button>
        </div>
      </div>

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

      <!-- Customers Table -->
      <div style="
        background:#fff;
        border:1px solid var(--line);
        border-radius:6px;
        overflow:hidden;
        box-shadow:0 2px 8px rgba(0,0,0,.03);
      ">
        <table style="width:100%;border-collapse:collapse;text-align:left;font-size:13.5px;">
          <thead>
            <tr style="background:var(--cream-2);border-bottom:1px solid var(--line);color:var(--wood-700);">
              <th style="padding:14px 18px;">ID</th>
              <th style="padding:14px 18px;">Customer</th>
              <th style="padding:14px 18px;">Phone</th>
              <th style="padding:14px 18px;">Email Verified</th>
              <th style="padding:14px 18px;">Account Status</th>
              <th style="padding:14px 18px;">Joined</th>
              <th style="padding:14px 18px;text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            @if (isLoading) {
              <tr>
                <td colspan="7" style="padding:40px;text-align:center;color:var(--wood-400);">
                  Loading customer accounts...
                </td>
              </tr>
            } @else if (filteredCustomers.length === 0) {
              <tr>
                <td colspan="7" style="padding:40px;text-align:center;color:var(--wood-400);">
                  No customers found matching your search.
                </td>
              </tr>
            } @else {
              @for (customer of filteredCustomers; track customer.id) {
                <tr style="border-bottom:1px solid var(--line);transition:background .15s;">
                  <td style="padding:14px 18px;color:var(--wood-400);font-weight:500;">
                    #{{ customer.id }}
                  </td>

                  <td style="padding:14px 18px;">
                    <div style="font-weight:600;color:var(--wood-900);">{{ customer.fullName }}</div>
                    <div style="font-size:12.5px;color:var(--wood-400);">{{ customer.email }}</div>
                  </td>

                  <td style="padding:14px 18px;color:var(--wood-700);">
                    {{ customer.phone || '—' }}
                  </td>

                  <td style="padding:14px 18px;">
                    @if (customer.emailVerified) {
                      <span class="badge" style="background:#E6EFE6;color:var(--ok);">
                        Verified
                      </span>
                    } @else {
                      <span class="badge" style="background:#FDF3E3;color:#8A6D3B;">
                        Unverified
                      </span>
                    }
                  </td>

                  <td style="padding:14px 18px;">
                    @if (customer.active) {
                      <span class="badge" style="background:#E6EFE6;color:var(--ok);">
                        Active
                      </span>
                    } @else {
                      <span class="badge" style="background:#FBEAE8;color:var(--danger);">
                        Deactivated
                      </span>
                    }
                  </td>

                  <td style="padding:14px 18px;color:var(--wood-400);font-size:12.5px;">
                    {{ customer.createdAt | date:'mediumDate' }}
                  </td>

                  <td style="padding:14px 18px;text-align:right;">
                    @if (customer.active) {
                      <button
                        type="button"
                        class="btn btn-outline btn-sm"
                        style="color:var(--danger);border-color:var(--danger);padding:6px 12px;font-size:11px;"
                        (click)="toggleStatus(customer, false)"
                      >
                        Deactivate
                      </button>
                    } @else {
                      <button
                        type="button"
                        class="btn btn-outline btn-sm"
                        style="color:var(--ok);border-color:var(--ok);padding:6px 12px;font-size:11px;"
                        (click)="toggleStatus(customer, true)"
                      >
                        Activate
                      </button>
                    }
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class CustomersComponent implements OnInit {
  private customerService = inject(CustomerService);

  customers: AdminCustomer[] = [];
  searchQuery = '';
  isLoading = false;
  feedbackMessage: string | null = null;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.isLoading = false;
        this.customers = data;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err?.error?.message || 'Failed to load customers.';
      },
    });
  }

  get filteredCustomers(): AdminCustomer[] {
    if (!this.searchQuery.trim()) return this.customers;
    const q = this.searchQuery.toLowerCase();
    return this.customers.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q))
    );
  }

  toggleStatus(customer: AdminCustomer, active: boolean): void {
    const action = active ? 'activate' : 'deactivate';
    if (!confirm(`Are you sure you want to ${action} ${customer.fullName}'s account?`)) {
      return;
    }

    this.feedbackMessage = null;
    this.errorMessage = null;

    this.customerService.updateStatus(customer.id, active).subscribe({
      next: (updated) => {
        customer.active = updated.active;
        this.feedbackMessage = `Customer ${customer.fullName} is now ${
          active ? 'Active' : 'Deactivated'
        }.`;
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.message || `Failed to ${action} customer.`;
      },
    });
  }
}
