import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  template: `
    <div class="wrap section">

      <div class="eyebrow">Wishlist</div>

      <h1
        class="serif"
        style="font-size:32px;font-weight:500;margin:10px 0 30px;"
      >
        Saved Items
      </h1>

      @if (items().length === 0) {

        <div class="empty-state card">

          <div class="empty-icon">♡</div>

          <h2>Your wishlist is empty</h2>

          <p>
            Save products you love and find them here later.
          </p>

          <a
            routerLink="/shop"
            class="btn btn-primary"
          >
            Browse Products
          </a>

        </div>

      } @else {

        <div class="wishlist-grid">

          @for (item of items(); track item.productId) {

            <div class="wishlist-item card">

              <!-- Product Image -->
              <div
                class="product-image"
                [style.background-image]="
                  item.image
                    ? 'url(' + item.image + ')'
                    : 'linear-gradient(135deg, #d6b58d, #8b5e3c)'
                "
              >
                @if (!item.image) {
                  <span>Board</span>
                }
              </div>

              <!-- Product Information -->
              <div class="wishlist-content">

                <div class="product-info">

                  <h3>
                    {{ item.name }}
                  </h3>

                  <p class="price">
                    Rs. {{ item.price | number }}
                  </p>

                </div>

                <!-- Actions -->
                <div class="actions">

                  <a
                    class="btn btn-primary btn-sm"
                    [routerLink]="['/product', item.productId]"
                  >
                    View
                  </a>

                  <button
                    type="button"
                    class="btn btn-outline btn-sm"
                    (click)="remove(item.productId)"
                  >
                    Remove
                  </button>

                </div>

              </div>

            </div>

          }

        </div>

      }

    </div>
  `,

  styles: [`

    /* Wishlist grid */
    .wishlist-grid {
      display: grid;
      grid-template-columns: repeat(
        auto-fill,
        minmax(420px, 1fr)
      );
      gap: 18px;
    }

    /* Wishlist card */
    .wishlist-item {
      display: flex;
      align-items: center;
      gap: 18px;

      padding: 14px;

      min-height: 150px;
    }

    /* Small product image */
    .product-image {
      width: 120px;
      height: 120px;

      min-width: 120px;

      border-radius: 10px;

      background-size: cover;
      background-position: center;

      display: flex;
      align-items: center;
      justify-content: center;

      color: white;
      font-weight: 600;
    }

    /* Right side of card */
    .wishlist-content {
      flex: 1;
      min-width: 0;

      display: flex;
      flex-direction: column;
      justify-content: space-between;

      min-height: 120px;
    }

    /* Product name */
    .product-info h3 {
      margin: 0 0 8px;

      font-size: 18px;
      font-weight: 600;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Product price */
    .price {
      margin: 0;

      color: var(--wood-700);

      font-size: 16px;
      font-weight: 600;
    }

    /* Buttons */
    .actions {
      display: flex;
      gap: 8px;

      margin-top: 14px;
    }

    .btn-sm {
      padding: 7px 14px;
      font-size: 13px;
    }

    /* Empty wishlist */
    .empty-state {
      padding: 60px 20px;
      text-align: center;
    }

    .empty-icon {
      font-size: 42px;
      color: var(--wood-500);

      margin-bottom: 12px;
    }

    .empty-state h2 {
      margin: 0 0 8px;

      font-size: 22px;
    }

    .empty-state p {
      margin: 0 0 22px;

      color: var(--wood-700);
    }

    /* Mobile */
    @media (max-width: 700px) {

      .wishlist-grid {
        grid-template-columns: 1fr;
      }

      .wishlist-item {
        gap: 14px;
        padding: 12px;
      }

      .product-image {
        width: 95px;
        height: 95px;
        min-width: 95px;
      }

      .wishlist-content {
        min-height: 95px;
      }

      .product-info h3 {
        font-size: 16px;
      }

      .actions {
        margin-top: 8px;
      }

    }

  `],
})
export class WishlistComponent {

  private readonly wishlistService =
    inject(WishlistService);

  readonly items =
    this.wishlistService.items;

  remove(productId: number): void {
    this.wishlistService.removeFromWishlist(productId);
  }
}