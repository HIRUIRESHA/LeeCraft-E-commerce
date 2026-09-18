import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="wrap section">
      <div class="eyebrow">Admin</div>
      <h1 class="serif" style="font-size:30px;font-weight:500;margin:10px 0 16px;">Inventory</h1>

      @if (errorMessage) {
        <p style="color:#b3261e;font-size:13px;margin-bottom:12px;">{{ errorMessage }}</p>
      }
      @if (successMessage) {
        <p style="color:#2f7d32;font-size:13px;margin-bottom:12px;">{{ successMessage }}</p>
      }

      <div class="card" style="padding:0;overflow:hidden;">
        <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
          <thead>
            <tr style="border-bottom:1px solid var(--line);text-align:left;">
              <th style="padding:12px 16px;">Product</th>
              <th style="padding:12px 16px;">Category</th>
              <th style="padding:12px 16px;">Current Stock</th>
              <th style="padding:12px 16px;">Update Stock</th>
              <th style="padding:12px 16px;"></th>
            </tr>
          </thead>
          <tbody>
            @for (p of products; track p.id) {
              <tr style="border-bottom:1px solid var(--line);">
                <td style="padding:10px 16px;">{{ p.name }}</td>
                <td style="padding:10px 16px;color:var(--wood-700);">{{ p.categoryName }}</td>
                <td style="padding:10px 16px;">
                  <span [style.color]="p.stockQuantity === 0 ? '#b3261e' : 'inherit'">
                    {{ p.stockQuantity === 0 ? 'Out of stock' : p.stockQuantity }}
                  </span>
                </td>
                <td style="padding:10px 16px;">
                  <input type="number" min="0" [(ngModel)]="stockEdits[p.id]"
                         style="width:80px;padding:6px;border:1px solid var(--line);border-radius:6px;" />
                </td>
                <td style="padding:10px 16px;">
                  <button class="btn" (click)="updateStock(p.id)"
                          [disabled]="stockEdits[p.id] == null || stockEdits[p.id] === p.stockQuantity">
                    Update
                  </button>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="5" style="padding:16px;text-align:center;color:var(--wood-400);">No products yet.</td></tr>
            }
          </tbody>
        </table>
      </div>
    </main>
  `,
})
export class InventoryComponent implements OnInit {
  products: Product[] = [];
  stockEdits: Record<number, number> = {};
  errorMessage = '';
  successMessage = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.stockEdits = {};
        data.forEach((p) => (this.stockEdits[p.id] = p.stockQuantity));
      },
      error: () => (this.errorMessage = 'Failed to load products. Is the backend running?'),
    });
  }

  updateStock(id: number): void {
    this.errorMessage = '';
    this.successMessage = '';
    const newQuantity = this.stockEdits[id];

    this.productService.updateStock(id, { stockQuantity: newQuantity }).subscribe({
      next: () => {
        this.successMessage = 'Stock updated.';
        this.load();
      },
      error: () => (this.errorMessage = 'Stock update failed.'),
    });
  }
}