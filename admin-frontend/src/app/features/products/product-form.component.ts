import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { UploadService } from '../../services/upload.service';
import {
  ProductRequest,
  MATERIAL_OPTIONS,
  SIZE_OPTIONS,
  SHAPE_OPTIONS,
  COLOR_OPTIONS,
} from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="wrap section">
      <div class="eyebrow">Admin</div>
      <h1
        class="serif"
        style="font-size:30px;font-weight:500;margin:10px 0 16px;"
      >
        {{ isEditMode ? 'Edit Product' : 'Add Product' }}
      </h1>

      <div class="card" style="padding:22px;max-width:560px;">
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

          <div style="margin-bottom:14px;">
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

          <div style="display:flex;gap:12px;margin-bottom:14px;">
            <div style="flex:1;">
              <label style="display:block;font-size:12.5px;margin-bottom:4px;"
                >Price (Rs.)</label
              >
              <input
                type="number"
                name="price"
                [(ngModel)]="form.price"
                required
                min="0.01"
                step="0.01"
                style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;"
              />
            </div>
            <div style="flex:1;">
              <label style="display:block;font-size:12.5px;margin-bottom:4px;"
                >Stock Quantity</label
              >
              <input
                type="number"
                name="stockQuantity"
                [(ngModel)]="form.stockQuantity"
                required
                min="0"
                style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;"
              />
            </div>
          </div>

          <div style="margin-bottom:14px;">
            <label style="display:block;font-size:12.5px;margin-bottom:4px;"
              >Category</label
            >
            <select
              name="categoryId"
              [(ngModel)]="form.categoryId"
              required
              style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;"
            >
              <option [ngValue]="null" disabled>Select a category</option>
              @for (c of categories; track c.id) {
                <option [ngValue]="c.id">{{ c.name }}</option>
              }
            </select>
          </div>

          <div style="display:flex;gap:12px;margin-bottom:14px;">
            <div style="flex:1;">
              <label style="display:block;font-size:12.5px;margin-bottom:4px;"
                >Material</label
              >
              <select
                name="material"
                [(ngModel)]="form.material"
                required
                style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;"
              >
                <option value="" disabled>Select material</option>
                @for (m of materialOptions; track m) {
                  <option [value]="m">{{ m }}</option>
                }
              </select>
            </div>
            <div style="flex:1;">
              <label style="display:block;font-size:12.5px;margin-bottom:4px;"
                >Size</label
              >
              <select
                name="size"
                [(ngModel)]="form.size"
                required
                style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;"
              >
                <option value="" disabled>Select size</option>
                @for (s of sizeOptions; track s) {
                  <option [value]="s">{{ s }}</option>
                }
              </select>
            </div>
          </div>

          <div style="display:flex;gap:12px;margin-bottom:14px;">
            <div style="flex:1;">
              <label style="display:block;font-size:12.5px;margin-bottom:4px;"
                >Shape</label
              >
              <select
                name="shape"
                [(ngModel)]="form.shape"
                required
                style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;"
              >
                <option value="" disabled>Select shape</option>
                @for (sh of shapeOptions; track sh) {
                  <option [value]="sh">{{ sh }}</option>
                }
              </select>
            </div>
            <div style="flex:1;">
              <label style="display:block;font-size:12.5px;margin-bottom:4px;"
                >Color</label
              >
              <select
                name="color"
                [(ngModel)]="form.color"
                required
                style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;"
              >
                <option value="" disabled>Select color</option>
                @for (c of colorOptions; track c) {
                  <option [value]="c">{{ c }}</option>
                }
              </select>
            </div>
          </div>

          <div style="margin-bottom:18px;">
            <label style="display:block;font-size:12.5px;margin-bottom:4px;"
              >Product Image</label
            >
            <input
              type="file"
              accept="image/*"
              (change)="onFileSelected($event)"
              style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;"
            />
            @if (uploading) {
              <p style="font-size:12.5px;color:var(--wood-700);margin-top:6px;">
                Uploading...
              </p>
            }
            @if (form.imageUrl) {
              <img
                [src]="form.imageUrl"
                alt="Preview"
                style="max-width:160px;margin-top:10px;border:1px solid var(--line);border-radius:6px;"
              />
            }
          </div>

          <button
            type="submit"
            class="btn"
            [disabled]="!isFormValid() || saving"
          >
            {{ isEditMode ? 'Update' : 'Add' }}
          </button>
          <a class="btn" routerLink="/products">Cancel</a>
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
export class ProductFormComponent implements OnInit {
  materialOptions = MATERIAL_OPTIONS;
  sizeOptions = SIZE_OPTIONS;
  shapeOptions = SHAPE_OPTIONS;
  colorOptions = COLOR_OPTIONS;

  form: ProductRequest = {
    name: '',
    description: '',
    price: 0,
    imageUrl: null,
    material: '',
    size: '',
    shape: '',
    color: '',
    stockQuantity: 0,
    categoryId: null as unknown as number,
  };
  categories: Category[] = [];
  isEditMode = false;
  productId: number | null = null;
  saving = false;
  uploading = false;
  errorMessage = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private uploadService: UploadService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => (this.categories = data),
      error: () =>
        (this.errorMessage = 'Could not load categories — add one first.'),
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.productId = Number(idParam);
      this.productService.getById(this.productId).subscribe({
        next: (product) => {
          this.form = {
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
            material: product.material,
            size: product.size,
            shape: product.shape,
            color: product.color,
            stockQuantity: product.stockQuantity,
            categoryId: product.categoryId,
          };
        },
        error: () => (this.errorMessage = 'Could not load this product.'),
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.uploading = true;
    this.errorMessage = '';

    this.uploadService.uploadImage(file).subscribe({
      next: (res) => {
        this.form.imageUrl = res.imageUrl;
        this.uploading = false;
      },
      error: () => {
        this.errorMessage = 'Image upload failed.';
        this.uploading = false;
      },
    });
  }

  isFormValid(): boolean {
    return (
      !!this.form.name &&
      this.form.price > 0 &&
      this.form.categoryId != null &&
      !!this.form.material &&
      !!this.form.size &&
      !!this.form.shape &&
      !!this.form.color &&
      this.form.stockQuantity >= 0 &&
      !this.uploading
    );
  }
  save(): void {
    this.saving = true;
    this.errorMessage = '';

    const action =
      this.isEditMode && this.productId
        ? this.productService.update(this.productId, this.form)
        : this.productService.create(this.form);

    action.subscribe({
      next: () => this.router.navigate(['/products']),
      error: (err) => {
        this.saving = false;
        this.errorMessage = err?.error?.message || 'Save failed.';
      },
    });
  }
}
