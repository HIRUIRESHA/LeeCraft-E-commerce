import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <footer class="site">
      <div class="wrap">
        <div class="grid fgrid">
          <div>
            <a class="brand" routerLink="/">
              <img class="logo" src="/assets/images/logo.png" alt="LeeCraft.lk" />
              <span class="name serif">LeeCraft.lk</span>
            </a>
            <p class="blurb">Naturally crafted, built to last. Handmade wooden cutting boards from Sri Lanka.</p>
          </div>

          <div>
            <h4>Shop</h4>
            <a routerLink="/shop">All Cutting Boards</a>
            <a routerLink="/shop">Best Sellers</a>
            <a routerLink="/cart">Cart</a>
          </div>

          <div>
            <h4>Company</h4>
            <a routerLink="/about">About Us</a>
            <a routerLink="/contact">Contact Us</a>
            <a routerLink="/faq">FAQ</a>
          </div>

          <div>
            <h4>Policies</h4>
            <a routerLink="/shipping">Shipping Policy</a>
            <a routerLink="/returns">Return &amp; Refund</a>
            <a routerLink="/privacy">Privacy Policy</a>
            <a routerLink="/terms">Terms &amp; Conditions</a>
            <a routerLink="/track">Track Order</a>
          </div>

          <div>
            <h4>Newsletter</h4>
            <p class="blurb">New pieces and offers, occasionally.</p>
            <form class="nform" #nlForm="ngForm" (ngSubmit)="subscribe(nlForm)">
              <input type="email" name="email" ngModel required placeholder="Your email" />
              <button type="submit">Join</button>
            </form>
          </div>
        </div>

        <div class="fbottom">
          <span>© {{ year }} LeeCraft.lk. All rights reserved.</span>
          <a routerLink="/admin">Admin</a>
        </div>
      </div>
    </footer>
  `,
    styles: [`
    footer.site{background:var(--wood-900);color:var(--wood-200);padding:60px 0 24px;}
    .brand{display:flex;align-items:center;gap:10px;text-decoration:none;margin-bottom:16px;}
    .brand .logo{height:34px;width:auto;display:block;filter:brightness(0) invert(1);}
    .brand .name{color:#FBF6EF;font-size:20px;}
    .blurb{font-size:13px;line-height:1.8;color:#B39F87;max-width:260px;}
    .fgrid{grid-template-columns:1.4fr 1fr 1fr 1fr 1.2fr;padding-bottom:44px;border-bottom:1px solid #4A3826;}
    .fgrid h4{font-size:12.5px;letter-spacing:1.5px;text-transform:uppercase;color:#F0E4D6;margin:0 0 16px;}
    .fgrid a{display:block;color:#B39F87;font-size:13px;margin-bottom:10px;cursor:pointer;text-decoration:none;}
    .fgrid a:hover{color:#fff;}
    .fbottom{display:flex;justify-content:space-between;padding-top:20px;font-size:12px;color:#8A7259;flex-wrap:wrap;gap:10px;}
    .fbottom a{color:#8A7259;text-decoration:none;}
    .nform{display:flex;max-width:420px;margin-top:20px;border:1px solid #4A3826;}
    .nform input{flex:1;border:none;background:transparent;padding:13px 16px;font-size:13px;outline:none;color:#F0E4D6;}
    .nform button{background:var(--wood-500);color:#fff;border:none;padding:0 22px;font-size:12px;letter-spacing:1px;text-transform:uppercase;cursor:pointer;}

    @media (max-width:860px){
      .fgrid{grid-template-columns:repeat(2,1fr);gap:30px;}
    }
  `],
})
export class FooterComponent {
    private readonly notify = inject(NotificationService);
    protected readonly year = new Date().getFullYear();

    subscribe(form: any): void {
        if (form.invalid) {
            form.control.markAllAsTouched();
            return;
        }
        this.notify.success('Thanks for subscribing!');
        form.resetForm();
    }
}