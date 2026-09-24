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
    <!-- Top Announcement Bar -->
    <div class="topbar">
      <span>Free island-wide delivery on orders over Rs. 8,000 &nbsp;&bull;&nbsp; Handcrafted in Sri Lanka &nbsp;&bull;&nbsp; 100% Food-Safe Hardwood</span>
    </div>

    <!-- Main Header Navbar -->
    <header class="site-header">
      <div class="wrap nav-row">
        <!-- Brand Logo -->
        <a class="brand" routerLink="/" (click)="closeMenu()">
          <img class="logo" src="/assets/images/logo.png" alt="LeeCraft.lk" />
          <span class="brand-text serif">LeeCraft<span class="accent">.lk</span></span>
        </a>

        <!-- Desktop Horizontal Navigation (Real Navbar) -->
        <nav class="desktop-nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
            <span>Home</span>
          </a>
          <a routerLink="/shop" routerLinkActive="active">
            <span>Shop</span>
          </a>
          <a routerLink="/about" routerLinkActive="active">
            <span>About</span>
          </a>
          <a routerLink="/contact" routerLinkActive="active">
            <span>Contact</span>
          </a>
          <a routerLink="/track-order" routerLinkActive="active" class="track-link">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
            <span>Track Order</span>
          </a>
        </nav>

        <!-- Action Icons (Search, Account, Wishlist, Cart) -->
        <div class="nav-actions">
          <!-- Search Button -->
          <button class="icon-btn" title="Search handcrafted items" (click)="toggleSearch()" aria-label="Search">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="11" cy="11" r="7"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>

          <!-- Account Button -->
          <button class="icon-btn" title="My Account" routerLink="/account" aria-label="Account">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>

          <!-- Wishlist Button -->
          <button class="icon-btn" title="Wishlist" routerLink="/wishlist" aria-label="Wishlist">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z"/>
            </svg>
            @if (wishlistCount() > 0) {
              <span class="count-badge">{{ wishlistCount() }}</span>
            }
          </button>

          <!-- Cart Button -->
          <button class="icon-btn" title="Cart" routerLink="/cart" aria-label="Shopping Cart">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span class="count-badge">{{ cartCount() }}</span>
          </button>

          <!-- Mobile Hamburger Toggle (Visible ONLY on mobile screens < 860px) -->
          <button
            class="mobile-toggle-btn"
            (click)="toggleMenu()"
            [attr.aria-expanded]="menuOpen()"
            aria-label="Toggle navigation menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              @if (menuOpen()) {
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              } @else {
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              }
            </svg>
          </button>
        </div>
      </div>

      <!-- Live Autocomplete Search Dropdown -->
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
                placeholder="Search cutting boards, timber crafts, bowls... (Press Enter to view all)"
                autofocus
              />
              @if (searchQuery()) {
                <button type="button" class="clear-btn" (click)="clearSearch()">✕</button>
              }
              <button type="button" class="close-search-btn" (click)="closeSearch()">Close</button>
            </div>

            <!-- Autocomplete Results -->
            @if (searchQuery().trim()) {
              <div class="search-dropdown">
                @if (isSearching()) {
                  <div class="search-loading">Searching handcrafted collection...</div>
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
                    No crafts found matching "<strong>{{ searchQuery() }}</strong>". Try searching for "teak", "board", or "wood".
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }

      <!-- Mobile Dropdown Navigation Menu (Mobile ONLY < 860px) -->
      @if (menuOpen()) {
        <div class="mobile-menu-drawer">
          <nav class="mobile-links">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeMenu()">
              <span>Home</span>
            </a>
            <a routerLink="/shop" routerLinkActive="active" (click)="closeMenu()">
              <span>Shop All Boards</span>
            </a>
            <a routerLink="/about" routerLinkActive="active" (click)="closeMenu()">
              <span>About Us</span>
            </a>
            <a routerLink="/contact" routerLinkActive="active" (click)="closeMenu()">
              <span>Contact Us</span>
            </a>
            <a routerLink="/track-order" routerLinkActive="active" (click)="closeMenu()" class="track-item">
              <span>🚚 Track Order Status</span>
            </a>
            <a routerLink="/account" routerLinkActive="active" (click)="closeMenu()">
              <span>My Account</span>
            </a>
            <a routerLink="/cart" routerLinkActive="active" (click)="closeMenu()">
              <span>Cart ({{ cartCount() }})</span>
            </a>
          </nav>
        </div>
      }
    </header>
  `,
  styles: [`
    /* Top Delivery Announcement */
    .topbar {
      background: var(--wood-900, #2A1D14);
      color: var(--wood-200, #D8C6B2);
      font-size: 12px;
      text-align: center;
      padding: 7px 16px;
      letter-spacing: 0.4px;
      font-weight: 400;
    }

    /* Main Sticky Header */
    .site-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--cream, #FBF6EF);
      border-bottom: 1px solid var(--line, #EADFCF);
      box-shadow: 0 2px 12px rgba(42, 29, 20, 0.04);
    }

    .nav-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 0;
      gap: 20px;
    }

    /* Brand Logo */
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      flex-shrink: 0;
    }
    .brand .logo {
      height: 38px;
      width: auto;
      display: block;
    }
    .brand .brand-text {
      font-size: 21px;
      color: var(--wood-800, #3B2A20);
      font-weight: 500;
      letter-spacing: -0.2px;
    }
    .brand .accent {
      color: var(--wood-400, #A9764F);
    }

    /* ==========================================================================
       REAL HORIZONTAL NAVBAR (DESKTOP)
       ========================================================================== */
    .desktop-nav {
      display: flex;
      align-items: center;
      gap: 28px;
    }
    .desktop-nav a {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 14.5px;
      font-weight: 500;
      color: var(--wood-700, #5C4530);
      text-decoration: none;
      padding: 6px 2px;
      position: relative;
      transition: color 0.18s ease;
    }
    .desktop-nav a:hover {
      color: var(--wood-500, #8A4B2E);
    }
    .desktop-nav a.active {
      color: var(--wood-500, #8A4B2E);
      font-weight: 600;
    }
    .desktop-nav a.active::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--wood-500, #8A4B2E);
      border-radius: 2px;
    }
    .track-link {
      background: rgba(138, 75, 46, 0.07);
      padding: 5px 12px !important;
      border-radius: 16px;
      border: 1px solid rgba(138, 75, 46, 0.18);
      font-size: 13.5px !important;
    }
    .track-link:hover {
      background: var(--wood-500, #8A4B2E) !important;
      color: #FFF !important;
      border-color: var(--wood-500, #8A4B2E);
    }
    .track-link.active::after {
      display: none !important;
    }

    /* Action Icons */
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    .icon-btn {
      position: relative;
      background: none;
      border: 1px solid transparent;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--wood-800, #3B2A20);
      cursor: pointer;
      transition: all 0.18s ease;
    }
    .icon-btn:hover {
      background: rgba(59, 42, 32, 0.08);
      color: var(--wood-500, #8A4B2E);
      transform: translateY(-1px);
    }
    .count-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      background: var(--wood-500, #8A4B2E);
      color: #FFF;
      font-size: 10px;
      font-weight: 700;
      min-width: 17px;
      height: 17px;
      padding: 0 4px;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--cream, #FBF6EF);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    }

    /* Mobile Hamburger Button */
    .mobile-toggle-btn {
      display: none;
      background: none;
      border: 1px solid var(--line, #EADFCF);
      border-radius: 8px;
      width: 38px;
      height: 38px;
      align-items: center;
      justify-content: center;
      color: var(--wood-800, #3B2A20);
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .mobile-toggle-btn:hover {
      background: rgba(59, 42, 32, 0.06);
    }

    /* ==========================================================================
       MOBILE DROPDOWN DRAWER (< 860px)
       ========================================================================== */
    .mobile-menu-drawer {
      background: #FFF;
      border-top: 1px solid var(--line, #EADFCF);
      border-bottom: 2px solid var(--wood-500, #8A4B2E);
      box-shadow: 0 10px 25px rgba(42, 29, 20, 0.1);
      animation: slideDown 0.2s ease-out;
    }
    .mobile-links {
      display: flex;
      flex-direction: column;
      padding: 12px 20px 20px;
      gap: 4px;
    }
    .mobile-links a {
      padding: 11px 14px;
      font-size: 14.5px;
      color: var(--wood-800, #3B2A20);
      text-decoration: none;
      font-weight: 500;
      border-radius: 8px;
      transition: background 0.15s ease, color 0.15s ease;
    }
    .mobile-links a:hover,
    .mobile-links a.active {
      background: var(--cream, #FBF6EF);
      color: var(--wood-500, #8A4B2E);
      font-weight: 600;
    }
    .mobile-links .track-item {
      background: rgba(138, 75, 46, 0.08);
      color: var(--wood-700, #5C4530);
      font-weight: 600;
    }

    /* ==========================================================================
       SEARCH OVERLAY
       ========================================================================== */
    .search-bar-wrap {
      background: #FFF;
      border-top: 1px solid var(--line, #EADFCF);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 150;
      padding: 16px 0 22px;
      animation: slideDown 0.2s ease-out;
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .search-inner {
      position: relative;
      max-width: 820px;
      margin: 0 auto;
    }
    .search-input-box {
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--cream, #FBF6EF);
      border: 1.5px solid var(--wood-400, #A9764F);
      border-radius: 8px;
      padding: 10px 16px;
    }
    .search-input-box input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: 15px;
      color: var(--wood-900, #2A1D14);
      outline: none;
    }
    .clear-btn {
      background: none;
      border: none;
      color: var(--wood-500, #8A4B2E);
      cursor: pointer;
      font-size: 14px;
    }
    .close-search-btn {
      background: none;
      border: 1px solid var(--line, #EADFCF);
      border-radius: 4px;
      padding: 5px 12px;
      font-size: 12px;
      font-weight: 500;
      color: var(--wood-700, #5C4530);
      cursor: pointer;
    }
    .close-search-btn:hover {
      background: var(--wood-100, #F3EADB);
    }

    .search-dropdown {
      margin-top: 10px;
      background: #FFF;
      border: 1px solid var(--line, #EADFCF);
      border-radius: 8px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      max-height: 420px;
      overflow-y: auto;
    }
    .search-loading {
      padding: 20px;
      text-align: center;
      color: var(--wood-500, #8A4B2E);
      font-size: 14px;
    }
    .results-header {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: var(--wood-500, #8A4B2E);
      padding: 10px 16px 6px;
      border-bottom: 1px solid var(--line, #EADFCF);
      background: #FAF8F5;
    }
    .result-row {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 10px 16px;
      cursor: pointer;
      border-bottom: 1px solid var(--line, #EADFCF);
      transition: background 0.15s ease;
    }
    .result-row:hover {
      background: var(--cream, #FBF6EF);
    }
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
    .result-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .result-details {
      flex: 1;
    }
    .result-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--wood-900, #2A1D14);
    }
    .result-meta {
      font-size: 12px;
      color: var(--wood-500, #8A4B2E);
      margin-top: 2px;
    }
    .result-rating {
      color: #D97706;
      font-weight: 600;
    }
    .result-price {
      font-size: 14px;
      font-weight: 600;
      color: var(--wood-800, #3B2A20);
    }
    .results-footer {
      padding: 12px 16px;
      background: #FAF8F5;
      font-size: 13px;
      font-weight: 500;
      color: var(--wood-700, #5C4530);
      cursor: pointer;
      text-align: center;
      transition: background 0.15s ease;
    }
    .results-footer:hover {
      background: var(--wood-100, #F3EADB);
      color: var(--wood-900, #2A1D14);
    }
    .no-results {
      padding: 24px;
      text-align: center;
      color: var(--wood-700, #5C4530);
      font-size: 13.5px;
    }

    /* ==========================================================================
       RESPONSIVE BREAKPOINT
       ========================================================================== */
    @media (max-width: 860px) {
      .desktop-nav {
        display: none;
      }
      .mobile-toggle-btn {
        display: flex;
      }
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

  closeMenu(): void {
    this.menuOpen.set(false);
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