import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CategoryRequest } from '../../models/category.model';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="wrap section">
      <div class="eyebrow">Admin</div>
      <h1
        class="serif"
        style="font-size:30px;font-weight:500;margin:10px 0 16px;"
      >
        {{ isEditMode ? 'Edit Category' : 'Add Category' }}
      </h1>

      <div class="card" style="padding:22px;max-width:520px;">
        <form (ngSubmit)="save()">
          <div style="margin-bottom:14px;">
            <label style="display:block;font-size:12.5px;margin-bottom:4px;"
              >Name</label
            >
            <input
              type="text"
              name="name"
              [(ngModel)]="form.name"
              required
              style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;"
            />
          </div>
          <div style="margin-bottom:18px;">
            <label style="display:block;font-size:12.5px;margin-bottom:4px;"
              >Description</label
            >
            <textarea
              name="description"
              [(ngModel)]="form.description"
              rows="3"
              style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;"
            ></textarea>
          </div>
          <button type="submit" class="btn" [disabled]="!form.name || saving">
            {{ isEditMode ? 'Update' : 'Add' }}
          </button>
          <a class="btn" routerLink="/categories">Cancel</a>
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
export class CategoryFormComponent implements OnInit {
  form: CategoryRequest = { name: '', description: '' };
  isEditMode = false;
  categoryId: number | null = null;
  saving = false;
  errorMessage = '';

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.categoryId = Number(idParam);
      this.categoryService.getById(this.categoryId).subscribe({
        next: (category) =>
          (this.form = {
            name: category.name,
            description: category.description,
          }),
        error: () => (this.errorMessage = 'Could not load this category.'),
      });
    }
  }

  save(): void {
    this.saving = true;
    this.errorMessage = '';

    const action =
      this.isEditMode && this.categoryId
        ? this.categoryService.update(this.categoryId, this.form)
        : this.categoryService.create(this.form);

    action.subscribe({
      next: () => this.router.navigate(['/categories']),
      error: (err) => {
        this.saving = false;
        this.errorMessage =
          err?.error?.message || 'Save failed — name may already be in use.';
      },
    });
  }
}
