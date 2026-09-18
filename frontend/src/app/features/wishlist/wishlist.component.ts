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
      <h1 class="serif" style="font-size:32px;font-weight:500;margin:10px 0 30px;">Saved Items</h1>

      @if (items().length === 0) {
        <div class="empty-state card">
          <p>Your wishlist is empty.</p>
          <a routerLink="/shop" class="btn btn-primary">Browse Products</a>
        </div>
      } @else {
        <div class="wishlist-grid">
          @for (item of items(); track item.productId) {
            <div class="wishlist-item card">
              <div class="thumb" [style.background-image]="item.image ? 'url(' + item.image + ')' : 'linear-gradient(135deg, #d6b58d, #8b5e3c)'">
                @if (!item.image) {
                  <span>Board</span>
                }
              </div>

              <div class="details">
                <h3>{{ item.name }}</h3>
                <p>Rs. {{ item.price | number }}</p>
              </div>

              <div class="actions">
                <button class="btn btn-primary" routerLink="/product/{{ item.productId }}">View</button>
                <button class="btn btn-outline" (click)="remove(item.productId)">Remove</button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .wishlist-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }
    .wishlist-item {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .thumb {
      width: 100%;
      height: 200px;
      border-radius: 12px;
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .details h3 {
      margin: 0 0 8px;
      font-size: 20px;
    }
    .details p {
      margin: 0;
      color: var(--wood-700);
    }
    .actions {
      display: flex;
      gap: 10px;
      margin-top: auto;
    }
    .empty-state {
      padding: 40px 20px;
      text-align: center;
    }
    .empty-state p {
      margin: 0 0 18px;
      font-size: 18px;
      color: var(--wood-700);
    }
  `],
})
export class WishlistComponent {
  private readonly wishlistService = inject(WishlistService);
  readonly items = this.wishlistService.items;

  remove(productId: string): void {
    this.wishlistService.removeFromWishlist(productId);
  }
}
