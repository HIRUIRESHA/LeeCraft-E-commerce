import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { woodSwatch } from '../../core/utils/wood-swatch';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule, DecimalPipe],
  template: `
    <div class="topbar">
      Free island-wide delivery on orders over Rs. 8,000 &nbsp;•&nbsp; Handcrafted in Sri Lanka
    </div>

    <header class="site">
      <div class="wrap navrow">
        <a class="brand" routerLink="/">
          <img class="logo" src="/assets/images/logo.png" alt="LeeCraft.lk" />
          <span class="name serif">LeeCraft<span class="accent">.lk</span></span>
        </a>

        <nav class="navlinks" [class.show]="menuOpen()">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          <a routerLink="/shop" routerLinkActive="active">Shop</a>
          <a routerLink="/about" routerLinkActive="active">About</a>
          <a routerLink="/contact" routerLinkActive="active">Contact</a>
          <a routerLink="/account" routerLinkActive="active">Account</a>
        </nav>

        <div class="navicons">
          <button class="icon-btn" title="Search" (click)="toggleSearch()">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
              <circle cx="11" cy="11" r="7"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
          <button class="icon-btn" title="Account" routerLink="/account">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
          <button class="icon-btn" title="Wishlist" routerLink="/wishlist">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z"/>
            </svg>
            <span class="count-badge" *ngIf="wishlistCount() > 0">{{ wishlistCount() }}</span>
          </button>
          <button class="icon-btn" title="Cart" routerLink="/cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span class="count-badge">{{ cartCount() }}</span>
          </button>
          <button class="mobile-toggle" (click)="toggleMenu()" aria-label="Toggle menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Live Search Overlay / Dropdown -->
      @if (searchOpen()) {
        <div class="search-bar-wrap">
          <div class="wrap search-inner">
            <div class="search-input-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--wood-500)" stroke-width="2">
                <circle cx="11" cy="11" r="7"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                [ngModel]="searchQuery()"
                (ngModelChange)="onSearchInput($event)"
                (keydown.enter)="goToShopWithSearch()"
                (keydown.escape)="closeSearch()"
                placeholder="Search cutting boards, craft items, bowls... (Press Enter to view all)"
                autofocus
              />
              @if (searchQuery()) {
                <button type="button" class="clear-btn" (click)="clearSearch()">✕</button>
              }
              <button type="button" class="close-search-btn" (click)="closeSearch()">Close</button>
            </div>

            <!-- Instant Autocomplete Results -->
            @if (searchQuery().trim()) {
              <div class="search-dropdown">
                @if (isSearching()) {
                  <div class="search-loading">Searching handcrafted catalog...</div>
                } @else if (searchResults().length > 0) {
                  <div class="results-header">Matching Items ({{ searchResults().length }})</div>
                  <div class="results-list">
                    @for (item of searchResults(); track item.id) {
                      <div class="result-row" (click)="selectProduct(item.id)">
                        <div class="result-thumb" [style.background]="item.image ? null : swatch(item.color)">
                          @if (item.image) {
                            <img [src]="item.image" [alt]="item.name" />
                          }
                        </div>
                        <div class="result-details">
                          <div class="result-title">{{ item.name }}</div>
                          <div class="result-meta">
                            {{ item.material }} &middot; {{ item.size }} &middot;
                            <span class="result-rating">★ {{ item.rating > 0 ? item.rating : 'New' }}</span>
                          </div>
                        </div>
                        <div class="result-price">Rs. {{ item.price | number }}</div>
                      </div>
                    }
                  </div>
                  <div class="results-footer" (click)="goToShopWithSearch()">
                    View all results for "{{ searchQuery() }}" &rarr;
                  </div>
                } @else {
                  <div class="no-results">
                    No crafts found matching "<strong>{{ searchQuery() }}</strong>". Try searching for "teak", "board", or "bowl".
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }
    </header>
  `,
  styles: [`
    .topbar { background: var(--wood-900); color: var(--wood-200); font-size: 12px; text-align: center; padding: 7px; letter-spacing: .4px; }
    header.site { position: sticky; top: 0; z-index: 40; background: var(--cream); border-bottom: 1px solid var(--line); }
    .navrow { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; }
    .brand { display: flex; align-items: center; gap: 10px; cursor: pointer; text-decoration: none; }
    .brand .logo { height: 38px; width: auto; display: block; }
    .brand .name { font-size: 20px; color: var(--wood-800); }
    .brand .accent { color: var(--wood-400); }
    .navlinks { display: flex; gap: 30px; }
    .navlinks a { font-size: 14px; color: var(--wood-800); cursor: pointer; text-decoration: none; }
    .navlinks a:hover, .navlinks a.active { color: var(--wood-500); }
    .navicons { display: flex; align-items: center; gap: 22px; }
    .icon-btn { position: relative; background: none; border: none; padding: 0; display: flex; color: var(--wood-800); cursor: pointer; }
    .count-badge { position: absolute; top: -8px; right: -9px; background: var(--wood-500); color: #fff; font-size: 10px; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .mobile-toggle { display: none; background: none; border: none; color: var(--wood-800); cursor: pointer; }

    /* Search Bar Dropdown */
    .search-bar-wrap {
      background: #fff;
      border-top: 1px solid var(--line);
      box-shadow: 0 10px 25px rgba(0,0,0,0.08);
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 50;
      padding: 16px 0 20px;
      animation: slideDown 0.2s ease-out;
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .search-inner { position: relative; max-width: 800px; margin: 0 auto; }
    .search-input-box {
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--cream);
      border: 1.5px solid var(--wood-400);
      border-radius: 8px;
      padding: 10px 16px;
    }
    .search-input-box input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: 15px;
      color: var(--wood-900);
      outline: none;
    }
    .clear-btn { background: none; border: none; color: var(--wood-500); cursor: pointer; font-size: 14px; }
    .close-search-btn {
      background: none;
      border: 1px solid var(--line);
      border-radius: 4px;
      padding: 4px 10px;
      font-size: 12px;
      color: var(--wood-700);
      cursor: pointer;
    }
    .close-search-btn:hover { background: var(--wood-100); }

    .search-dropdown {
      margin-top: 10px;
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 8px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.06);
      overflow: hidden;
      max-height: 420px;
      overflow-y: auto;
    }
    .search-loading { padding: 18px; text-align: center; color: var(--wood-500); font-size: 13.5px; }
    .results-header {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--wood-500);
      padding: 10px 16px 6px;
      border-bottom: 1px solid var(--line);
      background: #faf8f5;
    }
    .result-row {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 10px 16px;
      cursor: pointer;
      border-bottom: 1px solid var(--line);
      transition: background 0.15s ease;
    }
    .result-row:hover { background: var(--cream); }
    .result-thumb {
      width: 44px;
      height: 44px;
      border-radius: 6px;
      overflow: hidden;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .result-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .result-details { flex: 1; }
    .result-title { font-size: 14px; font-weight: 500; color: var(--wood-900); }
    .result-meta { font-size: 12px; color: var(--wood-500); margin-top: 2px; }
    .result-rating { color: #d97706; font-weight: 600; }
    .result-price { font-size: 14px; font-weight: 600; color: var(--wood-800); }
    .results-footer {
      padding: 12px 16px;
      background: #faf8f5;
      font-size: 13px;
      font-weight: 500;
      color: var(--wood-700);
      cursor: pointer;
      text-align: center;
      transition: background 0.15s ease;
    }
    .results-footer:hover { background: var(--wood-100); color: var(--wood-900); }
    .no-results { padding: 24px; text-align: center; color: var(--wood-700); font-size: 13.5px; }

    @media (max-width: 860px) {
      .navlinks {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--cream);
        border-bottom: 1px solid var(--line);
        flex-direction: column;
        gap: 0;
        padding: 6px 24px 14px;
      }
      .navlinks a { padding: 10px 0; border-bottom: 1px solid var(--line); }
      .navlinks.show { display: flex; }
      .mobile-toggle { display: block; }
    }
  `],
})
export class NavbarComponent {
  protected readonly menuOpen = signal(false);
  protected readonly searchOpen = signal(false);
  protected readonly searchQuery = signal('');
  protected readonly searchResults = signal<Product[]>([]);
  protected readonly isSearching = signal(false);

  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  protected readonly cartCount = computed(() => this.cartService.itemCount());
  protected readonly wishlistCount = computed(() => this.wishlistService.itemCount());

  private searchDebounceTimer: any = null;

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  toggleSearch(): void {
    this.searchOpen.update((v) => !v);
    if (!this.searchOpen()) {
      this.clearSearch();
    }
  }

  closeSearch(): void {
    this.searchOpen.set(false);
    this.clearSearch();
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.searchResults.set([]);
  }

  onSearchInput(query: string): void {
    this.searchQuery.set(query);
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    if (!query.trim()) {
      this.searchResults.set([]);
      this.isSearching.set(false);
      return;
    }

    this.isSearching.set(true);
    this.searchDebounceTimer = setTimeout(() => {
      this.productService.autocomplete(query).subscribe({
        next: (results) => {
          this.searchResults.set(results);
          this.isSearching.set(false);
        },
        error: () => {
          this.isSearching.set(false);
        },
      });
    }, 280);
  }

  selectProduct(productId: number): void {
    this.closeSearch();
    this.router.navigate(['/product', productId]);
  }

  goToShopWithSearch(): void {
    const q = this.searchQuery().trim();
    this.closeSearch();
    this.router.navigate(['/shop'], { queryParams: q ? { keyword: q } : {} });
  }

  swatch(color: string): string {
    return woodSwatch(color);
  }
}