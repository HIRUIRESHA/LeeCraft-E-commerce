import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
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
          <button class="icon-btn" title="Search" routerLink="/shop">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <button class="icon-btn" title="Account" routerLink="/account">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
          <button class="icon-btn" title="Wishlist" routerLink="/wishlist">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>
            <span class="count-badge" *ngIf="wishlistCount() > 0">{{ wishlistCount() }}</span>
          </button>
          <button class="icon-btn" title="Cart" routerLink="/cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span class="count-badge">{{ cartCount() }}</span>
          </button>
          <button class="mobile-toggle" (click)="toggleMenu()" aria-label="Toggle menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </div>
    </header>
  `,
    styles: [`
    .topbar{background:var(--wood-900);color:var(--wood-200);font-size:12px;text-align:center;padding:7px;letter-spacing:.4px;}
    header.site{position:sticky;top:0;z-index:40;background:var(--cream);border-bottom:1px solid var(--line);}
    .navrow{display:flex;align-items:center;justify-content:space-between;padding:16px 0;}
    .brand{display:flex;align-items:center;gap:10px;cursor:pointer;text-decoration:none;}
    .brand .logo{height:38px;width:auto;display:block;}
    .brand .name{font-size:20px;color:var(--wood-800);}
    .brand .accent{color:var(--wood-400);}
    .navlinks{display:flex;gap:30px;}
    .navlinks a{font-size:14px;color:var(--wood-800);cursor:pointer;text-decoration:none;}
    .navlinks a:hover,.navlinks a.active{color:var(--wood-500);}
    .navicons{display:flex;align-items:center;gap:22px;}
    .icon-btn{position:relative;background:none;border:none;padding:0;display:flex;color:var(--wood-800);cursor:pointer;}
    .count-badge{position:absolute;top:-8px;right:-9px;background:var(--wood-500);color:#fff;font-size:10px;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;}
    .mobile-toggle{display:none;background:none;border:none;color:var(--wood-800);cursor:pointer;}

    @media (max-width:860px){
      .navlinks{
        display:none;
        position:absolute;
        top:100%;
        left:0;
        right:0;
        background:var(--cream);
        border-bottom:1px solid var(--line);
        flex-direction:column;
        gap:0;
        padding:6px 24px 14px;
      }
      .navlinks a{padding:10px 0;border-bottom:1px solid var(--line);}
      .navlinks.show{display:flex;}
      .mobile-toggle{display:block;}
    }
  `],
})
export class NavbarComponent {
    protected readonly menuOpen = signal(false);
    private readonly cartService = inject(CartService);
    private readonly wishlistService = inject(WishlistService);
    protected readonly cartCount = computed(() => this.cartService.itemCount());
    protected readonly wishlistCount = computed(() => this.wishlistService.itemCount());

    toggleMenu(): void {
        this.menuOpen.update((v) => !v);
    }
}