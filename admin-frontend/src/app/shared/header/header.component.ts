import { Component, inject } from '@angular/core';
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
        <a class="brand" [href]="storefrontUrl">
          <div class="logo">L</div>
          <span class="name serif">LeeCraft<span style="color:var(--wood-400)">.lk</span></span>
        </a>

        @if (adminAuth.isAuthenticated()) {
          <nav class="navlinks">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>
            <a routerLink="/products" routerLinkActive="active">Products</a>
            <a routerLink="/categories" routerLinkActive="active">Categories</a>
            <a routerLink="/inventory" routerLinkActive="active">Inventory</a>
            <a routerLink="/customers" routerLinkActive="active">Customers</a>
            <a routerLink="/inquiries" routerLinkActive="active">Inquiries</a>
            <a routerLink="/banners" routerLinkActive="active">Banners</a>
            <a routerLink="/content" routerLinkActive="active">Content</a>
          </nav>

          <div class="navicons" style="display:flex;align-items:center;gap:16px;">
            <span class="admin-pill">Admin: {{ adminAuth.admin()?.fullName || 'Portal' }}</span>
            <button
              type="button"
              (click)="adminAuth.logout()"
              style="background:none;border:1px solid var(--line);border-radius:3px;padding:6px 12px;font-size:12px;cursor:pointer;color:var(--wood-700);"
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
  `,
})
export class HeaderComponent {
  readonly storefrontUrl = STOREFRONT_URL;
  readonly adminAuth = inject(AdminAuthService);
}
