import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';

/** URL of the customer-facing storefront app (separate Angular project/port). */
const STOREFRONT_URL = 'http://localhost:4200';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="topbar">Free island-wide delivery on orders over Rs. 8,000 &nbsp;&bull;&nbsp; Handcrafted in Sri Lanka</div>
    <header class="site">
      <div class="wrap navrow">
        <div class="navstart">
          @if (adminAuth.isAuthenticated()) {
            <button class="mobile-toggle" (click)="toggleMenu()" aria-label="Toggle menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          }
          <a class="brand" [href]="storefrontUrl">
            <img class="logo" src="/assets/images/logo.png" alt="LeeCraft.lk" />
          </a>
        </div>

        @if (adminAuth.isAuthenticated()) {
          <div class="navicons">
            <button
              type="button"
              class="signout-btn"
              (click)="adminAuth.logout()"
            >
              Sign Out
            </button>
          </div>
        } @else {
          <div class="navicons">
            <span class="admin-pill">Admin Console</span>
          </div>
        }
      </div>
    </header>

    @if (adminAuth.isAuthenticated()) {
      <div class="sidebar-overlay" [class.show]="menuOpen()" (click)="closeMenu()"></div>

      <aside class="sidebar" [class.open]="menuOpen()">
        <div class="sidebar-curve"></div>
        <div class="sidebar-head">
          <span class="name serif">LeeCraft<span class="accent">.lk</span></span>
          <button class="close-btn" (click)="closeMenu()" aria-label="Close menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <nav class="sidebar-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeMenu()" style="--i:0">
            <span class="dot"></span>
            <svg class="ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>
            <span class="label">Dashboard</span>
          </a>
          <a routerLink="/products" routerLinkActive="active" (click)="closeMenu()" style="--i:1">
            <span class="dot"></span>
            <svg class="ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>
            <span class="label">Products</span>
          </a>
          <a routerLink="/categories" routerLinkActive="active" (click)="closeMenu()" style="--i:2">
            <span class="dot"></span>
            <svg class="ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.6 12.4 12.6 20.4a2 2 0 0 1-2.8 0l-6.2-6.2a2 2 0 0 1 0-2.8L11.6 3.4a2 2 0 0 1 1.4-.6H19a2 2 0 0 1 2 2v6.2a2 2 0 0 1-.4 1.4Z"/><circle cx="15.5" cy="7.5" r="1.2"/></svg>
            <span class="label">Categories</span>
          </a>
          <a routerLink="/inventory" routerLinkActive="active" (click)="closeMenu()" style="--i:3">
            <span class="dot"></span>
            <svg class="ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 14h.01"/><path d="M12 14h4"/></svg>
            <span class="label">Inventory</span>
          </a>
          <a routerLink="/customers" routerLinkActive="active" (click)="closeMenu()" style="--i:4">
            <span class="dot"></span>
            <svg class="ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span class="label">Customers</span>
          </a>
          <a routerLink="/inquiries" routerLinkActive="active" (click)="closeMenu()" style="--i:5">
            <span class="dot"></span>
            <svg class="ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg>
            <span class="label">Inquiries</span>
          </a>
          <a routerLink="/banners" routerLinkActive="active" (click)="closeMenu()" style="--i:6">
            <span class="dot"></span>
            <svg class="ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.6"/><path d="m21 15-5-5-9 9"/></svg>
            <span class="label">Banners</span>
          </a>
          <a routerLink="/promotions" routerLinkActive="active" (click)="closeMenu()" style="--i:7">
            <span class="dot"></span>
            <svg class="ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
            <span class="label">Promotions</span>
          </a>
          <a routerLink="/content" routerLinkActive="active" (click)="closeMenu()" style="--i:8">
            <span class="dot"></span>
            <svg class="ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z"/><path d="M9 13h6"/><path d="M9 17h6"/></svg>
            <span class="label">Content</span>
          </a>
        </nav>

        <div class="sidebar-foot">
          <span class="serif">{{ adminAuth.admin()?.fullName || 'Admin Portal' }}</span>
        </div>
      </aside>
    }
  `,
  styles: [`
    .navstart{display:flex;align-items:center;gap:16px;}
    .mobile-toggle{background:none;border:none;color:var(--wood-800);cursor:pointer;display:flex;transition:transform .2s ease;}
    .mobile-toggle:active{transform:scale(.85) rotate(-8deg);}
    .signout-btn{
      background:none;border:1px solid var(--line);border-radius:20px;
      padding:8px 18px;font-size:12px;letter-spacing:.5px;text-transform:uppercase;
      cursor:pointer;color:var(--wood-700);font-weight:500;
      transition:background .2s ease, color .2s ease, border-color .2s ease;
    }
    .signout-btn:hover{background:var(--wood-800);color:#fff;border-color:var(--wood-800);}

    .sidebar-overlay{
      display:none;position:fixed;inset:0;
      background:rgba(20,12,6,.55);backdrop-filter:blur(2px);
      z-index:49;opacity:0;transition:opacity .35s ease;
    }
    .sidebar-overlay.show{display:block;opacity:1;}

    .sidebar{
      position:fixed;top:0;left:0;bottom:0;
      width:290px;max-width:84vw;
      background:linear-gradient(165deg,#fffaf3 0%,var(--cream) 55%,#f3e6d6 100%);
      z-index:50;display:flex;flex-direction:column;overflow:hidden;
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
      position:absolute;top:-90px;right:-110px;width:260px;height:260px;
      border-radius:50%;
      background:radial-gradient(circle at 30% 30%, var(--wood-400), var(--wood-800) 70%);
      opacity:.18;pointer-events:none;
    }
    .sidebar-head{position:relative;display:flex;align-items:center;justify-content:space-between;padding:26px 22px 18px;}
    .sidebar-head .name{font-size:19px;color:var(--wood-800);}
    .sidebar-head .accent{color:var(--wood-400);}
    .close-btn{
      width:32px;height:32px;border-radius:50%;border:none;
      display:flex;align-items:center;justify-content:center;
      background:rgba(87,58,33,.08);color:var(--wood-800);cursor:pointer;
      transition:transform .25s ease, background .25s ease;
    }
    .close-btn:hover{transform:rotate(90deg);background:rgba(87,58,33,.16);}

    .sidebar-links{position:relative;display:flex;flex-direction:column;gap:4px;padding:10px 16px;flex:1;overflow-y:auto;}
    .sidebar-links a{
      position:relative;display:flex;align-items:center;gap:13px;
      padding:11px 16px;border-radius:16px;
      color:var(--wood-700);text-decoration:none;font-size:14.5px;font-weight:500;
      opacity:0;transform:translateX(-24px);
      transition:transform .4s cubic-bezier(.22,1,.36,1), opacity .4s ease, color .2s ease, background .25s ease, box-shadow .25s ease;
      transition-delay:calc(var(--i, 0) * 55ms);
    }
    .sidebar.open .sidebar-links a{opacity:1;transform:translateX(0);}
    .sidebar-links a .ico{flex:0 0 auto;opacity:.85;transition:transform .25s ease;}
    .sidebar-links a .dot{
      position:absolute;left:-16px;top:50%;translate:0 -50%;
      width:6px;height:6px;border-radius:50%;background:var(--wood-500);
      opacity:0;transition:opacity .2s ease, left .25s ease;
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
      padding:16px 22px 22px;font-size:12px;letter-spacing:.5px;
      color:var(--wood-400);text-align:center;border-top:1px solid var(--line);
    }
  `],
})
export class HeaderComponent {
  readonly storefrontUrl = STOREFRONT_URL;
  readonly adminAuth = inject(AdminAuthService);
  protected readonly menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
