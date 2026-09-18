import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="wrap section">
      <div class="eyebrow">Admin</div>
      <div
        style="display:flex;justify-content:space-between;align-items:center;margin:10px 0 16px;"
      >
        <h1 class="serif" style="font-size:30px;font-weight:500;margin:0;">
          Products
        </h1>
        <a class="btn" routerLink="/products/new">+ Add Product</a>
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
              <th style="padding:12px 16px;">Category</th>
              <th style="padding:12px 16px;">Size</th>
              <th style="padding:12px 16px;">Price</th>
              <th style="padding:12px 16px;">Shape</th>
              <th style="padding:12px 16px;">Stock</th>

              <th style="padding:12px 16px;"></th>
            </tr>
          </thead>
          <tbody>
            @for (p of products; track p.id) {
              <tr style="border-bottom:1px solid var(--line);">
                <td style="padding:10px 16px;">{{ p.name }}</td>
                <td style="padding:10px 16px;color:var(--wood-700);">
                  {{ p.categoryName }}
                </td>
                <td style="padding:10px 16px;color:var(--wood-700);">
                  {{ p.size }}
                </td>
                <td style="padding:10px 16px;">Rs. {{ p.price }}</td>
                <td style="padding:10px 16px;">{{ p.shape }}</td>
                <td style="padding:10px 16px;">
                  <span
                    [style.color]="
                      p.stockQuantity === 0 ? '#b3261e' : 'inherit'
                    "
                  >
                    {{
                      p.stockQuantity === 0 ? 'Out of stock' : p.stockQuantity
                    }}
                  </span>
                </td>
                <td
                  style="padding:10px 16px;text-align:right;white-space:nowrap;"
                >
                  <a class="btn" [routerLink]="['/products', p.id, 'edit']"
                    >Edit</a
                  >
                  <button class="btn" (click)="remove(p.id)">Delete</button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td
                  colspan="6"
                  style="padding:16px;text-align:center;color:var(--wood-400);"
                >
                  No products yet.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </main>
  `,
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  errorMessage = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.productService.getAll().subscribe({
      next: (data) => (this.products = data),
      error: () =>
        (this.errorMessage =
          'Failed to load products. Is the backend running?'),
    });
  }

  remove(id: number): void {
    if (!confirm('Delete this product?')) return;
    this.productService.delete(id).subscribe({
      next: () => this.load(),
      error: () => (this.errorMessage = 'Delete failed.'),
    });
  }
}
