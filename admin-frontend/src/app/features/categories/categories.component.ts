import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="wrap section">
      <div class="eyebrow">Admin</div>
      <div
        style="display:flex;justify-content:space-between;align-items:center;margin:10px 0 16px;"
      >
        <h1 class="serif" style="font-size:30px;font-weight:500;margin:0;">
          Categories
        </h1>
        <a class="btn" routerLink="/categories/new">+ Add Category</a>
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
              <th style="padding:12px 16px;">Name</th>
              <th style="padding:12px 16px;">Description</th>
              <th style="padding:12px 16px;"></th>
            </tr>
          </thead>
          <tbody>
            @for (c of categories; track c.id) {
              <tr style="border-bottom:1px solid var(--line);">
                <td style="padding:10px 16px;">{{ c.name }}</td>
                <td style="padding:10px 16px;color:var(--wood-700);">
                  {{ c.description }}
                </td>
                <td
                  style="padding:10px 16px;text-align:right;white-space:nowrap;"
                >
                  <a class="btn" [routerLink]="['/categories', c.id, 'edit']"
                    >Edit</a
                  >
                  <button class="btn" (click)="remove(c.id)">Delete</button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td
                  colspan="3"
                  style="padding:16px;text-align:center;color:var(--wood-400);"
                >
                  No categories yet.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </main>
  `,
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  errorMessage = '';

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => (this.categories = data),
      error: () =>
        (this.errorMessage =
          'Failed to load categories. Is the backend running?'),
    });
  }

  remove(id: number): void {
    if (!confirm('Delete this category? Products using it may fail to load.'))
      return;
    this.categoryService.delete(id).subscribe({
      next: () => this.load(),
      error: () =>
        (this.errorMessage =
          'Delete failed — it may still have products assigned to it.'),
    });
  }
}
