import { Component } from '@angular/core';

/** URL of the customer-facing storefront app (separate Angular project/port). */
const STOREFRONT_URL = 'http://localhost:4200';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <div class="topbar">Free island-wide delivery on orders over Rs. 8,000 &nbsp;&bull;&nbsp; Handcrafted in Sri Lanka</div>
    <header class="site">
      <div class="wrap navrow">
        <a class="brand" [href]="storefrontUrl">
          <div class="logo">L</div>
          <span class="name serif">LeeCraft<span style="color:var(--wood-400)">.lk</span></span>
        </a>
        <nav class="navlinks">
          <a [href]="storefrontUrl">Home</a>
          <a [href]="storefrontUrl + '/shop'">Shop</a>
          <a [href]="storefrontUrl + '/about'">About</a>
          <a [href]="storefrontUrl + '/contact'">Contact</a>
          <a [href]="storefrontUrl + '/account'">Account</a>
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
