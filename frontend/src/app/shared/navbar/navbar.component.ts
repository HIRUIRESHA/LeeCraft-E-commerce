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
        <div class="navstart">
          <button class="mobile-toggle" (click)="toggleMenu()" aria-label="Toggle menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <a class="brand" routerLink="/">
            <img class="logo" src="/assets/images/logo.png" alt="LeeCraft.lk" />
            <span class="name serif">LeeCraft<span class="accent">.lk</span></span>
          </a>
        </div>

        <div class="navicons">
          <button class="icon-btn" title="Search" routerLink="/shop">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <button class="icon-btn" title="Account" routerLink="/account">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
          <button class="icon-btn" title="Wishlist" routerLink="/wishlist">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>
            <span class="count-badge" *ngIf="wishlistCount() > 0">{{ wishlistCount() }}</span>
          </button>
          <button class="icon-btn" title="Cart" routerLink="/cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span class="count-badge">{{ cartCount() }}</span>
          </button>
        </div>
      </div>
    </header>

    <div class="sidebar-overlay" [class.show]="menuOpen()" (click)="closeMenu()"></div>

    <aside class="sidebar" [class.open]="menuOpen()">
      <div class="sidebar-curve"></div>
      <div class="sidebar-head">
        <span class="name serif">LeeCraft<span class="accent">.lk</span></span>
        <button class="icon-btn close-btn" (click)="closeMenu()" aria-label="Close menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <nav class="sidebar-links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeMenu()" style="--i:0">
          <span class="dot"></span>
          <svg class="ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/></svg>
          <span class="label">Home</span>
        </a>
        <a routerLink="/shop" routerLinkActive="active" (click)="closeMenu()" style="--i:1">
          <span class="dot"></span>
          <svg class="ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <span class="label">Shop</span>
        </a>
        <a routerLink="/about" routerLinkActive="active" (click)="closeMenu()" style="--i:2">
          <span class="dot"></span>
          <svg class="ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16.5"/><circle cx="12" cy="7.8" r="1"/></svg>
          <span class="label">About</span>
        </a>
        <a routerLink="/contact" routerLinkActive="active" (click)="closeMenu()" style="--i:3">
          <span class="dot"></span>
          <svg class="ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>
          <span class="label">Contact</span>
        </a>
        <a routerLink="/account" routerLinkActive="active" (click)="closeMenu()" style="--i:4">
          <span class="dot"></span>
          <svg class="ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span class="label">Account</span>
        </a>
      </nav>

      <div class="sidebar-foot">
        <span class="serif">Handcrafted in Sri Lanka</span>
      </div>
    </aside>
  `,
    styles: [`
    .topbar{background:var(--wood-900);color:var(--wood-200);font-size:12px;text-align:center;padding:7px;letter-spacing:.4px;}
    header.site{position:sticky;top:0;z-index:40;background:var(--cream);border-bottom:1px solid var(--line);}
    .navrow{display:flex;align-items:center;justify-content:space-between;padding:16px 0;}
    .navstart{display:flex;align-items:center;gap:16px;}
    .brand{display:flex;align-items:center;gap:10px;cursor:pointer;text-decoration:none;}
    .brand .logo{height:38px;width:auto;display:block;}
    .brand .name{font-size:20px;color:var(--wood-800);}
    .brand .accent{color:var(--wood-400);}
    .navicons{display:flex;align-items:center;gap:6px;}
    .icon-btn{
      position:relative;
      background:none;
      border:none;
      width:42px;
      height:42px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      color:var(--wood-800);
      cursor:pointer;
      transition:background .2s ease, color .2s ease, transform .15s ease, box-shadow .2s ease;
    }
    .icon-btn:hover{background:var(--wood-800);color:#fff;box-shadow:0 6px 16px rgba(59,42,32,.28);}
    .icon-btn:active{transform:scale(.88);}
    .count-badge{
      position:absolute;top:2px;right:2px;
      background:linear-gradient(135deg,var(--wood-400),var(--wood-500));
      color:#fff;font-size:10px;font-weight:700;
      width:17px;height:17px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      border:2px solid var(--cream);
      box-shadow:0 2px 6px rgba(59,42,32,.35);
      transition:transform .2s ease, border-color .2s ease;
    }
    .icon-btn:hover .count-badge{border-color:var(--wood-800);transform:scale(1.08);}
    .mobile-toggle{background:none;border:none;color:var(--wood-800);cursor:pointer;display:flex;transition:transform .2s ease;}
    .mobile-toggle:active{transform:scale(.85) rotate(-8deg);}

    .sidebar-overlay{
      display:none;
      position:fixed;
      inset:0;
      background:rgba(20,12,6,.55);
      backdrop-filter:blur(2px);
      z-index:49;
      opacity:0;
      transition:opacity .35s ease;
    }
    .sidebar-overlay.show{display:block;opacity:1;}

    .sidebar{
      position:fixed;
      top:0;
      left:0;
      bottom:0;
      width:290px;
      max-width:84vw;
      background:linear-gradient(165deg,#fffaf3 0%,var(--cream) 55%,#f3e6d6 100%);
      z-index:50;
      display:flex;
      flex-direction:column;
      overflow:hidden;
      border-radius:0 38px 38px 0;
      transform-origin:left center;
      transform:perspective(1400px) rotateY(-100deg) translateX(-30px);
      opacity:0;
      transition:transform .5s cubic-bezier(.22,1,.36,1), opacity .35s ease, box-shadow .5s ease;
      box-shadow:none;
      pointer-events:none;
    }
    .sidebar.open{
      transform:perspective(1400px) rotateY(0deg) translateX(0);
      opacity:1;
      box-shadow:20px 0 44px rgba(20,12,6,.38), 2px 0 0 rgba(0,0,0,.06) inset;
      pointer-events:auto;
    }
    .sidebar-curve{
      position:absolute;
      top:-90px;
      right:-110px;
      width:260px;
      height:260px;
      border-radius:50%;
      background:radial-gradient(circle at 30% 30%, var(--wood-400), var(--wood-800) 70%);
      opacity:.18;
      pointer-events:none;
    }
    .sidebar-head{position:relative;display:flex;align-items:center;justify-content:space-between;padding:26px 22px 18px;}
    .sidebar-head .name{font-size:19px;color:var(--wood-800);}
    .sidebar-head .accent{color:var(--wood-400);}
    .close-btn{
      width:32px;height:32px;border-radius:50%;
      justify-content:center;align-items:center;
      background:rgba(87,58,33,.08);
      transition:transform .25s ease, background .25s ease;
    }
    .close-btn:hover{transform:rotate(90deg);background:rgba(87,58,33,.16);}

    .sidebar-links{position:relative;display:flex;flex-direction:column;gap:6px;padding:14px 16px;flex:1;}
    .sidebar-links a{
      position:relative;
      display:flex;
      align-items:center;
      gap:13px;
      padding:12px 16px;
      border-radius:16px;
      color:var(--wood-700);
      text-decoration:none;
      font-size:15px;
      font-weight:500;
      opacity:0;
      transform:translateX(-24px);
      transition:transform .4s cubic-bezier(.22,1,.36,1), opacity .4s ease, color .2s ease, background .25s ease, box-shadow .25s ease;
      transition-delay:calc(var(--i, 0) * 70ms);
    }
    .sidebar.open .sidebar-links a{opacity:1;transform:translateX(0);}
    .sidebar-links a .ico{flex:0 0 auto;opacity:.85;transition:transform .25s ease;}
    .sidebar-links a .dot{
      position:absolute;left:-16px;top:50%;translate:0 -50%;
      width:6px;height:6px;border-radius:50%;
      background:var(--wood-500);
      opacity:0;
      transition:opacity .2s ease, left .25s ease;
    }
    .sidebar-links a:hover{background:rgba(87,58,33,.08);color:var(--wood-800);}
    .sidebar-links a:hover .ico{transform:scale(1.12);}
    .sidebar-links a.active{
      color:#fff;
      background:linear-gradient(120deg,var(--wood-500),var(--wood-800));
      box-shadow:0 8px 18px rgba(87,58,33,.32);
    }
    .sidebar-links a.active .ico{opacity:1;}
    .sidebar-links a.active .dot{opacity:1;left:-10px;}

    .sidebar-foot{
      padding:18px 22px 24px;
      font-size:12px;
      letter-spacing:.5px;
      color:var(--wood-400);
      text-align:center;
      border-top:1px solid var(--line);
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

    closeMenu(): void {
        this.menuOpen.set(false);
    }
}