import { Component, OnInit } from '@angular/core';
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
        <h1 class="serif" style="font-size:30px;font-weight:500;margin:0;">Promotions</h1>
        <a class="btn" routerLink="/promotions/new">+ Add Promotion</a>
      </div>

      @if (errorMessage) {
        <p style="color:#b3261e;font-size:13px;margin-bottom:12px;">{{ errorMessage }}</p>
      }

      <div class="card" style="padding:0;overflow:hidden;">
        <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
          <thead>
            <tr style="border-bottom:1px solid var(--line);text-align:left;">
              <th style="padding:12px 16px;">Title</th>
              <th style="padding:12px 16px;">Code</th>
              <th style="padding:12px 16px;">Discount</th>
              <th style="padding:12px 16px;">Validity</th>
              <th style="padding:12px 16px;">Status</th>
              <th style="padding:12px 16px;"></th>
            </tr>
          </thead>
          <tbody>
            @for (p of promotions; track p.id) {
              <tr style="border-bottom:1px solid var(--line);">
                <td style="padding:10px 16px;">{{ p.title }}</td>
                <td style="padding:10px 16px;">{{ p.code }}</td>
                <td style="padding:10px 16px;">{{ p.discountPercent }}%</td>
                <td style="padding:10px 16px;">{{ p.startDate }} → {{ p.endDate }}</td>
                <td style="padding:10px 16px;">
                  <button class="btn" (click)="toggleStatus(p.id)">
                    {{ p.active ? 'Active' : 'Inactive' }}
                  </button>
                </td>
                <td style="padding:10px 16px;text-align:right;white-space:nowrap;">
                  <a class="btn" [routerLink]="['/promotions', p.id, 'edit']">Edit</a>
                  <button class="btn" (click)="remove(p.id)">Delete</button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" style="padding:16px;text-align:center;color:var(--wood-400);">No promotions yet.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </main>
  `,
})
export class PromotionsComponent implements OnInit {
  promotions: Promotion[] = [];
  errorMessage = '';

  constructor(private promotionService: PromotionService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.promotionService.getAll().subscribe({
      next: (data) => (this.promotions = data),
      error: () => (this.errorMessage = 'Failed to load promotions. Is the backend running?'),
    });
  }

  toggleStatus(id: number): void {
    this.promotionService.toggleStatus(id).subscribe({
      next: () => this.load(),
      error: () => (this.errorMessage = 'Could not update promotion status.'),
    });
  }

  remove(id: number): void {
    if (!confirm('Delete this promotion?')) return;
    this.promotionService.delete(id).subscribe({
      next: () => this.load(),
      error: () => (this.errorMessage = 'Delete failed.'),
    });
  }
}
