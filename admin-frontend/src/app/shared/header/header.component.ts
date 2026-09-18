import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';


/** URL of the customer-facing storefront app (separate Angular project/port). */
const STOREFRONT_URL = 'http://localhost:4300';

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
        <nav class="navlinks">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>
          <a routerLink="/products" routerLinkActive="active">Products</a>
          <a routerLink="/categories" routerLinkActive="active">Categories</a>
          <a routerLink="/inventory" routerLinkActive="active">Inventory</a>
        </nav>
        <div class="navicons">
          <span class="admin-pill">Admin</span>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  readonly storefrontUrl = STOREFRONT_URL;
}
