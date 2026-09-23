import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PromotionService } from '../../services/promotion.service';
import { Promotion } from '../../models/promotion.model';

@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="wrap section">
      <div class="eyebrow">Admin</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin:10px 0 16px;">
        <div>
          <h1 class="serif" style="font-size:30px;font-weight:500;margin:0 0 4px;">
            Promotions & Discounts
          </h1>
          <p style="margin:0;font-size:13px;color:var(--wood-500);">
            Manage coupon codes, discounts, usage limits, and active promotions.
          </p>
        </div>
        <a class="btn" routerLink="/promotions/new">+ Add Promotion</a>
      </div>

      @if (errorMessage) {
        <p style="color:#b3261e;font-size:13px;margin-bottom:12px;">
          {{ errorMessage }}
        </p>
      }

      @if (successMessage) {
        <p style="color:var(--ok);font-size:13px;margin-bottom:12px;">
          {{ successMessage }}
        </p>
      }

      <div class="card" style="padding:0;overflow:hidden;">
        <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
          <thead>
            <tr style="border-bottom:1px solid var(--line);text-align:left;background:rgba(0,0,0,0.02);">
              <th style="padding:12px 16px;">Title & Code</th>
              <th style="padding:12px 16px;">Discount</th>
              <th style="padding:12px 16px;">Conditions</th>
              <th style="padding:12px 16px;">Usage</th>
              <th style="padding:12px 16px;">Status</th>
              <th style="padding:12px 16px;text-align:right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (p of promotions; track p.id) {
              <tr style="border-bottom:1px solid var(--line);">
                <td style="padding:12px 16px;">
                  <div style="font-weight:600;color:var(--wood-800);">{{ p.title }}</div>
                  @if (p.code) {
                    <span style="display:inline-block;margin-top:4px;background:rgba(0,0,0,0.06);border:1px dashed var(--line);padding:2px 8px;border-radius:3px;font-family:monospace;font-size:12px;font-weight:600;letter-spacing:1px;">
                      {{ p.code }}
                    </span>
                  } @else {
                    <span style="font-size:11px;color:var(--wood-400);">Automatic deal (no code)</span>
                  }
                  @if (p.description) {
                    <div style="font-size:12px;color:var(--wood-400);margin-top:2px;">{{ p.description }}</div>
                  }
                </td>
                <td style="padding:12px 16px;font-weight:600;color:var(--wood-700);">
                  @if (p.discountType === 'PERCENTAGE') {
                    {{ p.discountValue }}% Off
                    @if (p.maxDiscountAmount) {
                      <div style="font-size:11px;font-weight:400;color:var(--wood-400);">Up to Rs. {{ p.maxDiscountAmount | number }}</div>
                    }
                  } @else {
                    Rs. {{ p.discountValue | number }} Off
                  }
                </td>
                <td style="padding:12px 16px;font-size:12px;color:var(--wood-600);">
                  @if (p.minOrderAmount) {
                    <div>Min. Order: Rs. {{ p.minOrderAmount | number }}</div>
                  }
                  @if (p.startDate || p.endDate) {
                    <div>
                      {{ p.startDate ? (p.startDate | date:'shortDate') : 'Now' }} -
                      {{ p.endDate ? (p.endDate | date:'shortDate') : 'Ongoing' }}
                    </div>
                  }
                  @if (!p.minOrderAmount && !p.startDate && !p.endDate) {
                    <span style="color:var(--wood-400);">None</span>
                  }
                </td>
                <td style="padding:12px 16px;font-size:12.5px;">
                  <span>{{ p.usageCount }}</span>
                  @if (p.usageLimit) {
                    <span style="color:var(--wood-400);"> / {{ p.usageLimit }}</span>
                  }
                </td>
                <td style="padding:12px 16px;">
                  @if (p.active) {
                    <span class="badge" style="background:#E6EFE6;color:var(--ok);">Active</span>
                  } @else {
                    <span class="badge" style="background:#FBEAE8;color:var(--danger);">Inactive</span>
                  }
                </td>
                <td style="padding:12px 16px;text-align:right;white-space:nowrap;">
                  <a class="btn" [routerLink]="['/promotions', p.id, 'edit']" style="margin-right:6px;">Edit</a>
                  <button class="btn" (click)="toggleActive(p)" style="margin-right:6px;">
                    {{ p.active ? 'Deactivate' : 'Activate' }}
                  </button>
                  <button class="btn" (click)="remove(p.id)" style="color:var(--danger);">Delete</button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" style="padding:32px;text-align:center;color:var(--wood-400);">
                  No promotions or discounts found. Click "+ Add Promotion" to create one!
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </main>
  `,
})
export class PromotionsComponent implements OnInit {
  private promotionService = inject(PromotionService);

  promotions: Promotion[] = [];
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.promotionService.getAll().subscribe({
      next: (data) => (this.promotions = data),
      error: () =>
        (this.errorMessage = 'Failed to load promotions. Is the backend running?'),
    });
  }

  toggleActive(promotion: Promotion): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.promotionService.setActive(promotion.id, !promotion.active).subscribe({
      next: (updated) => {
        promotion.active = updated.active;
        this.successMessage = `Promotion '${promotion.title}' is now ${promotion.active ? 'active' : 'deactivated'}.`;
      },
      error: () => (this.errorMessage = 'Failed to update promotion status.'),
    });
  }

  remove(id: number): void {
    if (!confirm('Are you sure you want to delete this promotion? This action cannot be undone.')) {
      return;
    }
    this.errorMessage = '';
    this.successMessage = '';
    this.promotionService.delete(id).subscribe({
      next: () => {
        this.promotions = this.promotions.filter((p) => p.id !== id);
        this.successMessage = 'Promotion deleted successfully.';
      },
      error: () => (this.errorMessage = 'Failed to delete promotion.'),
    });
  }
}
