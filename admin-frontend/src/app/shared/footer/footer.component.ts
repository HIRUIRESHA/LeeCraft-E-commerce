import { Component } from '@angular/core';

/** URL of the customer-facing storefront app (separate Angular project/port). */
const STOREFRONT_URL = 'http://localhost:4300';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="site">
      <div class="wrap">
        <div class="grid fgrid">
          <div>
            <a class="brand" style="margin-bottom:16px;" [href]="storefrontUrl">
              <img class="logo" style="filter:brightness(0) invert(1);" src="/assets/images/logo.png" alt="LeeCraft.lk" />
            </a>
            <p style="font-size:13px;line-height:1.8;color:#B39F87;max-width:260px;">
              Naturally crafted, built to last. Handmade wooden cutting boards from Sri Lanka.
            </p>
          </div>
          <div>
            <h4>Shop</h4>
            <a [href]="storefrontUrl + '/shop'">All Cutting Boards</a>
            <a [href]="storefrontUrl + '/shop?sort=best-sellers'">Best Sellers</a>
            <a [href]="storefrontUrl + '/cart'">Cart</a>
          </div>
          <div>
            <h4>Company</h4>
            <a [href]="storefrontUrl + '/about'">About Us</a>
            <a [href]="storefrontUrl + '/contact'">Contact Us</a>
          </div>
          <div>
            <h4>Account</h4>
            <a [href]="storefrontUrl + '/account'">My Account</a>
            <a [href]="storefrontUrl + '/login'">Log In</a>
            <a [href]="storefrontUrl + '/register'">Register</a>
          </div>
          <div>
            <h4>Newsletter</h4>
            <p style="font-size:13px;color:#B39F87;margin-bottom:0;">New pieces and offers, occasionally.</p>
            <form class="nform" (submit)="$event.preventDefault()">
              <input type="email" required placeholder="Your email" />
              <button type="submit">Join</button>
            </form>
          </div>
        </div>
        <div class="fbottom">
          <span>&copy; {{ year }} LeeCraft.lk. All rights reserved.</span>
          <span>Admin Dashboard</span>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly storefrontUrl = STOREFRONT_URL;
  readonly year = new Date().getFullYear();
}
