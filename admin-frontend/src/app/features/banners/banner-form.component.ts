import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BannerService } from '../../services/banner.service';
import { UploadService } from '../../services/upload.service';
import { BannerRequest } from '../../models/banner.model';

@Component({
  selector: 'app-banner-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="wrap section">
      <div class="eyebrow">Admin</div>
      <h1 class="serif" style="font-size:30px;font-weight:500;margin:10px 0 16px;">
        {{ isEditMode ? 'Edit Banner' : 'Add Banner' }}
      </h1>

      <div class="card" style="padding:22px;max-width:560px;">
        <form (ngSubmit)="save()">
          <div style="margin-bottom:14px;">
            <label style="display:block;font-size:12.5px;margin-bottom:4px;">Title</label>
            <input
              type="text"
              name="title"
              [(ngModel)]="form.title"
              required
              style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;"
            />
          </div>
          <div style="margin-bottom:14px;">
            <label style="display:block;font-size:12.5px;margin-bottom:4px;">Subtitle</label>
            <input
              type="text"
              name="subtitle"
              [(ngModel)]="form.subtitle"
              style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;"
            />
          </div>
          <div style="margin-bottom:14px;">
            <label style="display:block;font-size:12.5px;margin-bottom:4px;">Banner Image</label>
            <input type="file" accept="image/*" (change)="onFileSelected($event)" />
            @if (uploading) {
              <p style="font-size:12px;color:var(--wood-400);margin-top:6px;">Uploading…</p>
            }
            @if (form.imageUrl) {
              <img [src]="form.imageUrl" alt="Preview" style="margin-top:10px;max-width:260px;border-radius:6px;" />
            }
          </div>
          <div style="margin-bottom:14px;">
            <label style="display:block;font-size:12.5px;margin-bottom:4px;">Link URL (optional)</label>
            <input
              type="text"
              name="linkUrl"
              [(ngModel)]="form.linkUrl"
              placeholder="/shop"
              style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;"
            />
          </div>
          <div style="margin-bottom:14px;">
            <label style="display:block;font-size:12.5px;margin-bottom:4px;">Display Order</label>
            <input
              type="number"
              name="displayOrder"
              [(ngModel)]="form.displayOrder"
              style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;"
            />
          </div>
          <div style="margin-bottom:18px;display:flex;align-items:center;gap:8px;">
            <input type="checkbox" id="active" name="active" [(ngModel)]="form.active" />
            <label for="active" style="font-size:13px;">Active</label>
          </div>
          <button type="submit" class="btn" [disabled]="!form.title || !form.imageUrl || saving">
            {{ isEditMode ? 'Update' : 'Add' }}
          </button>
          <a class="btn" routerLink="/banners">Cancel</a>
        </form>
        @if (errorMessage) {
          <p style="color:#b3261e;font-size:13px;margin-top:10px;">
            {{ errorMessage }}
          </p>
        }
      </div>
    </main>
  `,
})
export class BannerFormComponent implements OnInit {
  form: BannerRequest = {
    title: '',
    subtitle: '',
    imageUrl: '',
    linkUrl: '',
    displayOrder: 0,
    active: true,
  };
  isEditMode = false;
  bannerId: number | null = null;
  saving = false;
  uploading = false;
  errorMessage = '';

  constructor(
    private bannerService: BannerService,
    private uploadService: UploadService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.bannerId = Number(idParam);
      this.bannerService.getById(this.bannerId).subscribe({
        next: (banner) =>
          (this.form = {
            title: banner.title,
            subtitle: banner.subtitle,
            imageUrl: banner.imageUrl,
            linkUrl: banner.linkUrl,
            displayOrder: banner.displayOrder,
            active: banner.active,
          }),
        error: () => (this.errorMessage = 'Could not load this banner.'),
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploading = true;
    this.uploadService.uploadImage(file).subscribe({
      next: (res) => {
        this.uploading = false;
        this.form.imageUrl = res.imageUrl;
      },
      error: () => {
        this.uploading = false;
        this.errorMessage = 'Image upload failed.';
      },
    });
  }

  save(): void {
    this.saving = true;
    this.errorMessage = '';

    const action =
      this.isEditMode && this.bannerId
        ? this.bannerService.update(this.bannerId, this.form)
        : this.bannerService.create(this.form);

    action.subscribe({
      next: () => this.router.navigate(['/banners']),
      error: (err) => {
        this.saving = false;
        this.errorMessage = err?.error?.message || 'Save failed.';
      },
    });
  }
}
