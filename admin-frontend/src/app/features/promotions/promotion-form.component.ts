import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PromotionService } from '../../services/promotion.service';
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

      <div class="card" style="padding:22px;max-width:680px;">
        <form (ngSubmit)="save()">
          <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;">
            <div>
              <label style="display:block;font-size:12.5px;margin-bottom:4px;">Title</label>
              <input type="text" name="title" [(ngModel)]="form.title" required style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;" />
            </div>
            <div>
              <label style="display:block;font-size:12.5px;margin-bottom:4px;">Code</label>
              <input type="text" name="code" [(ngModel)]="form.code" required style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;" />
            </div>
            <div>
              <label style="display:block;font-size:12.5px;margin-bottom:4px;">Discount %</label>
              <input type="number" name="discountPercent" [(ngModel)]="form.discountPercent" min="0" max="100" step="0.01" required style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;" />
            </div>
            <div>
              <label style="display:block;font-size:12.5px;margin-bottom:4px;">Status</label>
              <select name="active" [(ngModel)]="form.active" style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;">
                <option [ngValue]="true">Active</option>
                <option [ngValue]="false">Inactive</option>
              </select>
            </div>
            <div>
              <label style="display:block;font-size:12.5px;margin-bottom:4px;">Start Date</label>
              <input type="date" name="startDate" [(ngModel)]="form.startDate" required style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;" />
            </div>
            <div>
              <label style="display:block;font-size:12.5px;margin-bottom:4px;">End Date</label>
              <input type="date" name="endDate" [(ngModel)]="form.endDate" required style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;" />
            </div>
          </div>

          <div style="margin-top:16px;">
            <label style="display:block;font-size:12.5px;margin-bottom:4px;">Description</label>
            <textarea name="description" [(ngModel)]="form.description" rows="4" style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;"></textarea>
          </div>

          <div style="margin-top:18px;">
            <button type="submit" class="btn" [disabled]="saving || !form.title || !form.code || !form.startDate || !form.endDate">
              {{ isEditMode ? 'Update' : 'Add' }}
            </button>
            <a class="btn" routerLink="/promotions">Cancel</a>
          </div>
        </form>

        @if (errorMessage) {
          <p style="color:#b3261e;font-size:13px;margin-top:10px;">{{ errorMessage }}</p>
        }
      </div>
    </main>
  `,
})
export class PromotionFormComponent implements OnInit {
  form: PromotionRequest = {
    title: '',
    code: '',
    description: '',
    discountPercent: 0,
    active: true,
    startDate: '',
    endDate: '',
  };

  isEditMode = false;
  promotionId: number | null = null;
  saving = false;
  errorMessage = '';

  constructor(
    private promotionService: PromotionService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.promotionId = Number(idParam);
      this.promotionService.getById(this.promotionId).subscribe({
        next: (promotion) => {
          this.form = {
            title: promotion.title,
            code: promotion.code,
            description: promotion.description || '',
            discountPercent: promotion.discountPercent,
            active: promotion.active,
            startDate: promotion.startDate,
            endDate: promotion.endDate,
          };
        },
        error: () => (this.errorMessage = 'Could not load this promotion.'),
      });
    }
  }

  save(): void {
    this.saving = true;
    this.errorMessage = '';

    const action =
      this.isEditMode && this.promotionId
        ? this.promotionService.update(this.promotionId, this.form)
        : this.promotionService.create(this.form);

    action.subscribe({
      next: () => this.router.navigate(['/promotions']),
      error: (err) => {
        this.saving = false;
        this.errorMessage = err?.error?.message || 'Save failed.';
      },
    });
  }
}
