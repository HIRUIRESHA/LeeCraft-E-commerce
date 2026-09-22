import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PromotionService } from '../../services/promotion.service';
import { UploadService } from '../../services/upload.service';
import { PromotionRequest } from '../../models/promotion.model';

@Component({
  selector: 'app-promotion-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="wrap section">
      <div class="eyebrow">Admin</div>
      <h1 class="serif" style="font-size:30px;font-weight:500;margin:10px 0 16px;">
        {{ isEditMode ? 'Edit Promotion' : 'Add Promotion' }}
      </h1>

      <div class="card" style="padding:24px;max-width:640px;">
        <form (ngSubmit)="save()">
          <div style="margin-bottom:14px;">
            <label style="display:block;font-size:12.5px;font-weight:600;margin-bottom:4px;">
              Title <span style="color:var(--danger);">*</span>
            </label>
            <input
              type="text"
              name="title"
              [(ngModel)]="form.title"
              required
              placeholder="e.g. 10% Off First Order"
              style="width:100%;padding:9px;border:1px solid var(--line);border-radius:6px;font-size:14px;"
            />
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">
            <div>
              <label style="display:block;font-size:12.5px;font-weight:600;margin-bottom:4px;">
                Promo Code
              </label>
              <input
                type="text"
                name="code"
                [(ngModel)]="form.code"
                placeholder="e.g. LEECRAFT10"
                style="width:100%;padding:9px;border:1px solid var(--line);border-radius:6px;font-size:14px;text-transform:uppercase;font-family:monospace;"
              />
              <small style="color:var(--wood-400);font-size:11px;">Optional: Leave empty for automatic promotions.</small>
            </div>

            <div>
              <label style="display:block;font-size:12.5px;font-weight:600;margin-bottom:4px;">
                Discount Type <span style="color:var(--danger);">*</span>
              </label>
              <select
                name="discountType"
                [(ngModel)]="form.discountType"
                style="width:100%;padding:9px;border:1px solid var(--line);border-radius:6px;font-size:14px;background:#fff;"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED_AMOUNT">Fixed Amount (Rs.)</option>
              </select>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">
            <div>
              <label style="display:block;font-size:12.5px;font-weight:600;margin-bottom:4px;">
                Discount Value <span style="color:var(--danger);">*</span>
              </label>
              <input
                type="number"
                name="discountValue"
                [(ngModel)]="form.discountValue"
                required
                min="0.01"
                [max]="form.discountType === 'PERCENTAGE' ? 100 : 999999"
                step="0.01"
                [placeholder]="form.discountType === 'PERCENTAGE' ? 'e.g. 10' : 'e.g. 500'"
                style="width:100%;padding:9px;border:1px solid var(--line);border-radius:6px;font-size:14px;"
              />
            </div>

            <div>
              <label style="display:block;font-size:12.5px;font-weight:600;margin-bottom:4px;">
                Min. Order Amount (Rs.)
              </label>
              <input
                type="number"
                name="minOrderAmount"
                [(ngModel)]="form.minOrderAmount"
                min="0"
                step="0.01"
                placeholder="e.g. 1000"
                style="width:100%;padding:9px;border:1px solid var(--line);border-radius:6px;font-size:14px;"
              />
            </div>
          </div>

          @if (form.discountType === 'PERCENTAGE') {
            <div style="margin-bottom:14px;">
              <label style="display:block;font-size:12.5px;font-weight:600;margin-bottom:4px;">
                Max Discount Cap (Rs.)
              </label>
              <input
                type="number"
                name="maxDiscountAmount"
                [(ngModel)]="form.maxDiscountAmount"
                min="0"
                step="0.01"
                placeholder="e.g. 2000 (leave blank for no cap)"
                style="width:100%;padding:9px;border:1px solid var(--line);border-radius:6px;font-size:14px;"
              />
            </div>
          }

          <div style="margin-bottom:14px;">
            <label style="display:block;font-size:12.5px;font-weight:600;margin-bottom:4px;">Description</label>
            <textarea
              name="description"
              [(ngModel)]="form.description"
              rows="2"
              placeholder="e.g. Apply code LEECRAFT10 at checkout to save 10% on your order."
              style="width:100%;padding:9px;border:1px solid var(--line);border-radius:6px;font-size:14px;resize:vertical;"
            ></textarea>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">
            <div>
              <label style="display:block;font-size:12.5px;font-weight:600;margin-bottom:4px;">Start Date</label>
              <input
                type="datetime-local"
                name="startDate"
                [(ngModel)]="startDateString"
                style="width:100%;padding:9px;border:1px solid var(--line);border-radius:6px;font-size:13px;"
              />
            </div>

            <div>
              <label style="display:block;font-size:12.5px;font-weight:600;margin-bottom:4px;">End Date</label>
              <input
                type="datetime-local"
                name="endDate"
                [(ngModel)]="endDateString"
                style="width:100%;padding:9px;border:1px solid var(--line);border-radius:6px;font-size:13px;"
              />
            </div>
          </div>

          <div style="margin-bottom:14px;">
            <label style="display:block;font-size:12.5px;font-weight:600;margin-bottom:4px;">
              Usage Limit (Max Redemptions)
            </label>
            <input
              type="number"
              name="usageLimit"
              [(ngModel)]="form.usageLimit"
              min="1"
              placeholder="e.g. 100 (leave blank for unlimited)"
              style="width:100%;padding:9px;border:1px solid var(--line);border-radius:6px;font-size:14px;"
            />
          </div>

          <div style="margin-bottom:14px;">
            <label style="display:block;font-size:12.5px;font-weight:600;margin-bottom:4px;">Promo Banner Image (optional)</label>
            <input type="file" accept="image/*" (change)="onFileSelected($event)" />
            @if (uploading) {
              <p style="font-size:12px;color:var(--wood-400);margin-top:6px;">Uploading…</p>
            }
            @if (form.bannerUrl) {
              <div style="margin-top:8px;">
                <img [src]="form.bannerUrl" alt="Banner Preview" style="max-width:240px;border-radius:6px;border:1px solid var(--line);" />
              </div>
            }
          </div>

          <div style="margin-bottom:20px;display:flex;align-items:center;gap:8px;">
            <input type="checkbox" id="active" name="active" [(ngModel)]="form.active" />
            <label for="active" style="font-size:13.5px;font-weight:500;">Active (available for customers)</label>
          </div>

          <div style="display:flex;gap:10px;align-items:center;">
            <button type="submit" class="btn" [disabled]="!form.title || !form.discountValue || saving">
              {{ isEditMode ? 'Save Changes' : 'Create Promotion' }}
            </button>
            <a class="btn" routerLink="/promotions" style="background:transparent;border:1px solid var(--line);">Cancel</a>
          </div>
        </form>

        @if (errorMessage) {
          <p style="color:#b3261e;font-size:13px;margin-top:14px;background:#FBEAE8;padding:8px 12px;border-radius:4px;">
            {{ errorMessage }}
          </p>
        }
      </div>
    </main>
  `,
})
export class PromotionFormComponent implements OnInit {
  form: PromotionRequest = {
    title: '',
    description: '',
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minOrderAmount: null,
    maxDiscountAmount: null,
    startDate: null,
    endDate: null,
    usageLimit: null,
    active: true,
    bannerUrl: '',
  };

  startDateString = '';
  endDateString = '';

  isEditMode = false;
  promotionId: number | null = null;
  saving = false;
  uploading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private promotionService: PromotionService,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.promotionId = Number(idParam);
      this.promotionService.getById(this.promotionId).subscribe({
        next: (p) => {
          this.form = {
            title: p.title,
            description: p.description || '',
            code: p.code || '',
            discountType: p.discountType,
            discountValue: p.discountValue,
            minOrderAmount: p.minOrderAmount ?? null,
            maxDiscountAmount: p.maxDiscountAmount ?? null,
            startDate: p.startDate ?? null,
            endDate: p.endDate ?? null,
            usageLimit: p.usageLimit ?? null,
            active: p.active,
            bannerUrl: p.bannerUrl || '',
          };
          if (p.startDate) {
            this.startDateString = p.startDate.substring(0, 16);
          }
          if (p.endDate) {
            this.endDateString = p.endDate.substring(0, 16);
          }
        },
        error: () => (this.errorMessage = 'Failed to load promotion.'),
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.uploading = true;
    this.errorMessage = '';
    this.uploadService.uploadImage(input.files[0]).subscribe({
      next: (res) => {
        this.form.bannerUrl = res.imageUrl;
        this.uploading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to upload image.';
        this.uploading = false;
      },
    });
  }

  save(): void {
    if (!this.form.title || !this.form.discountValue) return;

    this.saving = true;
    this.errorMessage = '';

    const payload: PromotionRequest = {
      ...this.form,
      code: this.form.code ? this.form.code.trim().toUpperCase() : '',
      startDate: this.startDateString ? this.startDateString : null,
      endDate: this.endDateString ? this.endDateString : null,
      minOrderAmount: this.form.minOrderAmount ? Number(this.form.minOrderAmount) : null,
      maxDiscountAmount: this.form.maxDiscountAmount ? Number(this.form.maxDiscountAmount) : null,
      usageLimit: this.form.usageLimit ? Number(this.form.usageLimit) : null,
    };

    const action$ =
      this.isEditMode && this.promotionId
        ? this.promotionService.update(this.promotionId, payload)
        : this.promotionService.create(payload);

    action$.subscribe({
      next: () => this.router.navigate(['/promotions']),
      error: (err) => {
        this.errorMessage =
          err?.error?.message ||
          (this.isEditMode ? 'Failed to update promotion.' : 'Failed to create promotion.');
        this.saving = false;
      },
    });
  }
}
