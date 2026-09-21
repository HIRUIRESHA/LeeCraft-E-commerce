import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BannerService } from '../../services/banner.service';
import { Banner } from '../../models/banner.model';

@Component({
  selector: 'app-banners',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="wrap section">
      <div class="eyebrow">Admin</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin:10px 0 16px;">
        <h1 class="serif" style="font-size:30px;font-weight:500;margin:0;">
          Homepage Banners
        </h1>
        <a class="btn" routerLink="/banners/new">+ Add Banner</a>
      </div>

      @if (errorMessage) {
        <p style="color:#b3261e;font-size:13px;margin-bottom:12px;">
          {{ errorMessage }}
        </p>
      }

      <div class="card" style="padding:0;overflow:hidden;">
        <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
          <thead>
            <tr style="border-bottom:1px solid var(--line);text-align:left;">
              <th style="padding:12px 16px;">Image</th>
              <th style="padding:12px 16px;">Title</th>
              <th style="padding:12px 16px;">Order</th>
              <th style="padding:12px 16px;">Status</th>
              <th style="padding:12px 16px;"></th>
            </tr>
          </thead>
          <tbody>
            @for (b of banners; track b.id) {
              <tr style="border-bottom:1px solid var(--line);">
                <td style="padding:10px 16px;">
                  <img [src]="b.imageUrl" [alt]="b.title" style="width:72px;height:44px;object-fit:cover;border-radius:4px;" />
                </td>
                <td style="padding:10px 16px;">
                  <div style="font-weight:600;">{{ b.title }}</div>
                  <div style="font-size:12px;color:var(--wood-400);">{{ b.subtitle }}</div>
                </td>
                <td style="padding:10px 16px;">{{ b.displayOrder }}</td>
                <td style="padding:10px 16px;">
                  @if (b.active) {
                    <span class="badge" style="background:#E6EFE6;color:var(--ok);">Active</span>
                  } @else {
                    <span class="badge" style="background:#FBEAE8;color:var(--danger);">Inactive</span>
                  }
                </td>
                <td style="padding:10px 16px;text-align:right;white-space:nowrap;">
                  <a class="btn" [routerLink]="['/banners', b.id, 'edit']">Edit</a>
                  <button class="btn" (click)="toggleActive(b)">
                    {{ b.active ? 'Deactivate' : 'Activate' }}
                  </button>
                  <button class="btn" (click)="remove(b.id)">Delete</button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5" style="padding:16px;text-align:center;color:var(--wood-400);">
                  No banners yet.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </main>
  `,
})
export class BannersComponent implements OnInit {
  private bannerService = inject(BannerService);

  banners: Banner[] = [];
  errorMessage = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.bannerService.getAll().subscribe({
      next: (data) => (this.banners = data),
      error: () =>
        (this.errorMessage = 'Failed to load banners. Is the backend running?'),
    });
  }

  toggleActive(banner: Banner): void {
    this.bannerService.setActive(banner.id, !banner.active).subscribe({
      next: (updated) => (banner.active = updated.active),
      error: () => (this.errorMessage = 'Failed to update banner status.'),
    });
  }

  remove(id: number): void {
    if (!confirm('Delete this banner?')) return;
    this.bannerService.delete(id).subscribe({
      next: () => this.load(),
      error: () => (this.errorMessage = 'Delete failed.'),
    });
  }
}
