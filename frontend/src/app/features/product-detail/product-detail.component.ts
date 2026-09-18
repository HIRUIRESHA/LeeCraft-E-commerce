import { DecimalPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { woodSwatch } from '../../core/utils/wood-swatch';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    @if (product(); as p) {
      <div class="wrap section">
        <div class="pd-layout">
          <div class="pd-gallery">
            <div
              class="main-img"
              [style.background]="p.image ? null : swatch(p.color)"
            >
              @if (p.image) {
                <img [src]="p.image" [alt]="p.name" />
              }
            </div>
          </div>
          <div class="pd-info">
            <div class="eyebrow">{{ p.material }} &middot; {{ p.size }}</div>
            <h1 class="serif">{{ p.name }}</h1>
            <div class="pd-price">
              <span class="now">Rs. {{ p.price | number }}</span>
              @if (p.oldPrice) {
                <span class="old">Rs. {{ p.oldPrice | number }}</span>
              }
            </div>
            <p class="pd-desc-short">{{ p.description }}</p>

            <div class="qty-row">
              <div class="qty-stepper">
                <button type="button" (click)="qty.set(Math.max(1, qty() - 1))">
                  &minus;
                </button>
                <span>{{ qty() }}</span>
                <button type="button" (click)="qty.set(qty() + 1)">+</button>
              </div>
              <span style="font-size:12.5px;color:var(--wood-400);">
                {{ p.inStock ? 'In Stock' : 'Out of Stock' }}
              </span>
            </div>

            <div class="pd-actions">
              <button
                class="btn btn-primary"
                style="flex:1;"
                (click)="addToCart(p)"
              >
                Add to Cart
              </button>
              <button
                class="btn btn-outline"
                style="flex:1;"
                (click)="buyNow(p)"
              >
                Buy Now
              </button>
            </div>

            <div class="trust-row">
              <div class="item">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--wood-500)"
                  stroke-width="1.6"
                  style="flex-shrink:0;"
                >
                  <rect x="1" y="3" width="15" height="13" />
                  <path d="M16 8h4l3 3v5h-7z" />
                  <circle cx="5.5" cy="18.5" r="2" />
                  <circle cx="18.5" cy="18.5" r="2" />
                </svg>
                Island-wide delivery, 3&ndash;5 working days
              </div>
              <div class="item">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--wood-500)"
                  stroke-width="1.6"
                  style="flex-shrink:0;"
                >
                  <path d="M3 12a9 9 0 1 0 9-9" />
                  <path d="M3 12h9V3" />
                </svg>
                7-day return &amp; refund policy
              </div>
              <div class="item">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--wood-500)"
                  stroke-width="1.6"
                  style="flex-shrink:0;"
                >
                  <rect x="4" y="10" width="16" height="10" rx="1" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                We'll contact you to confirm payment
              </div>
              <div class="item">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--wood-500)"
                  stroke-width="1.6"
                  style="flex-shrink:0;"
                >
                  <path d="M12 2 3 7v6c0 5 4 8 9 9 5-1 9-4 9-9V7z" />
                </svg>
                1-year workmanship warranty
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <p class="center" style="padding:80px 0;color:var(--wood-700);">
        Loading...
      </p>
    }
  `,
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | undefined>(undefined);
  qty = signal(1);
  Math = Math;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private products: ProductService,
    //  private cart: CartService,
    private notifications: NotificationService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      return;
    }

    const id = Number(idParam);

    this.products.get(id).subscribe({
      next: (product) => {
        this.product.set(product);
      },
      error: (error) => {
        console.error('Failed to load product:', error);
        this.product.set(undefined);
      },
    });
  }

  addToCart(product: Product): void {
    //   this.cart.add(product, this.qty());
    this.notifications.success(`${product.name} added to cart.`);
  }

  swatch(color: string): string {
    return woodSwatch(color);
  }

  buyNow(product: Product): void {
    //   this.cart.add(product, this.qty());
    this.router.navigate(['/checkout']);
  }
}
