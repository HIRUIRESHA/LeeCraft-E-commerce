import { DecimalPipe } from '@angular/common';
import { Component, Input, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product } from '../../core/models/product.model';
import { woodSwatch } from '../../core/utils/wood-swatch';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  template: `
    <a [routerLink]="['/product', product.id]" class="pcard card">
      <div class="thumb" [style.background]="product.image ? null : swatch()">
        @if (product.oldPrice) {
          <span class="tag-discount"> -{{ discountPct() }}% </span>
        }

        <button
          type="button"
          class="wish"
          [class.active]="isWishlisted()"
          (click)="onWishlist($event)"
          title="Wishlist"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            [attr.fill]="isWishlisted() ? 'currentColor' : 'none'"
            stroke="currentColor"
            stroke-width="1.7"
          >
            <path
              d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z"
            />
          </svg>
        </button>

        @if (product.image) {
          <img [src]="product.image" [alt]="product.name" />
        }
      </div>

      <div class="body">
        <h3 class="pname">
          {{ product.name }}
        </h3>

        <p class="pmeta">
          {{ product.material }}
          &middot;
          {{ product.size }}
          &middot;

          <span class="stars">
            {{ starString() }}
          </span>

          ({{ product.reviewCount }})
        </p>

        <div class="prow">
          <span class="price">
            Rs. {{ product.price | number }}

            @if (product.oldPrice) {
              <span class="old"> Rs. {{ product.oldPrice | number }} </span>
            }
          </span>

          <div class="prow-actions">
            <button
              type="button"
              class="btn btn-outline btn-sm"
              (click)="onView($event)"
            >
              View
            </button>

            <button
              type="button"
              class="addbtn"
              [disabled]="!product.inStock"
              (click)="onAdd($event)"
            >
              {{ product.inStock ? 'Add' : 'Sold Out' }}
            </button>
          </div>
        </div>
      </div>
    </a>
  `,
  styles: [`
    .wish {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 30px;
      height: 30px;
      border: 1px solid rgba(255,255,255,0.7);
      background: rgba(255,255,255,0.72);
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--wood-700);
      cursor: pointer;
      transition: all 0.2s ease;
      z-index: 2;
    }
    .wish.active {
      background: var(--wood-500);
      border-color: var(--wood-500);
      color: white;
    }
    .pcard {
      position: relative;
    }
    .thumb {
      position: relative;
    }
  `],
})
export class ProductCardComponent {
  @Input({ required: true })
  product!: Product;

  private notifications = inject(NotificationService);
  private router = inject(Router);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);

  isWishlisted = computed(() => this.wishlistService.isInWishlist(this.product.id));

  discountPct = computed(() => {
    const old = this.product.oldPrice;

    if (!old) {
      return 0;
    }

    return Math.round(((old - this.product.price) / old) * 100);
  });

  starString(): string {
    const full = '★'.repeat(this.product.rating);
    const empty = '☆'.repeat(5 - this.product.rating);

    return full + empty;
  }

  swatch(): string {
    return woodSwatch(this.product.color);
  }

  onWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const isAdded = this.wishlistService.toggleWishlist(this.product);
    this.notifications.success(
      isAdded ? `${this.product.name} added to wishlist.` : `${this.product.name} removed from wishlist.`
    );
  }

  onAdd(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.product.inStock) {
      return;
    }

    this.cartService.addToCart(this.product, 1);
    this.notifications.success(`${this.product.name} added to cart.`);
  }

  onView(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    console.log('View clicked, navigating to id:', this.product.id);
    this.router.navigate(['/product', this.product.id]);
  }
}
