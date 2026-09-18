import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="hero">
      <img
        class="bg"
        src="/assets/images/hero-cover.jpg"
        alt="Handcrafted wooden cutting boards"
      />
      <div class="overlay"></div>
      <div class="wrap">
        <div class="content">
          <div class="eyebrow hero-anim d1 light">Handcrafted in Sri Lanka</div>
          <h1 class="hero-anim d2">
            Cutting Boards Built<br />For Real Kitchens.
          </h1>
          <p class="hero-anim d3">
            Solid hardwood boards — food-safe, durable and easy to clean —
            shaped by hand and finished with natural oils.
          </p>
          <div class="hero-anim d4 hero-actions">
            <button class="btn btn-primary" routerLink="/shop">Shop Now</button>
            <button class="btn btn-outline-light" routerLink="/about">
              Our Story
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap center intro">
        <div class="eyebrow">LeeCraft.lk</div>
        <h2 class="serif">Naturally Crafted. Built To Last.</h2>
        <p>
          Every board is cut from responsibly sourced Sri Lankan hardwood and
          shaped by local artisans — no two boards are ever quite the same.
        </p>
      </div>
    </section>

    <section class="section top-flush">
      <div class="wrap">
        <div class="eyebrow center">Best Sellers</div>
        <h2 class="serif center">Featured Cutting Boards</h2>
        <div class="grid pgrid">
          <div class="card pcard" *ngFor="let p of featured()">
            <div class="thumb">
              <img
                *ngIf="p.image"
                [src]="p.image"
                [alt]="p.name"
                style="width:100%;height:100%;object-fit:cover;"
              />

              <div *ngIf="!p.image" class="thumb-fallback"></div>
            </div>

            <div class="body">
              <div class="pname">{{ p.name }}</div>

              <div class="pmeta">{{ p.material }} · {{ p.size }}</div>

              <div class="prow">
                <span class="price"> Rs. {{ p.price | number }} </span>

                <button class="addbtn" [routerLink]="['/product', p.id]">
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section shaded">
      <div class="wrap">
        <div class="eyebrow center">Why LeeCraft</div>
        <h2 class="serif center">Why Choose Us</h2>
        <div class="grid why-grid">
          <div class="why-item">
            <div class="ic">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h3>Food-Safe Materials</h3>
            <p>
              Finished with food-grade mineral oil, safe for direct contact with
              fresh produce and meat.
            </p>
          </div>
          <div class="why-item">
            <div class="ic">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
              >
                <path d="M12 2 3 7v6c0 5 4 8 9 9 5-1 9-4 9-9V7z" />
              </svg>
            </div>
            <h3>Durable</h3>
            <p>
              Dense hardwoods that resist knife scarring and hold up to years of
              daily chopping.
            </p>
          </div>
          <div class="why-item">
            <div class="ic">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
              >
                <path d="M3 12a9 9 0 1 0 9-9" />
                <path d="M3 12h9V3" />
              </svg>
            </div>
            <h3>Easy To Clean</h3>
            <p>
              Naturally antibacterial wood grain — wipe clean, rinse and air-dry
              in minutes.
            </p>
          </div>
          <div class="why-item">
            <div class="ic">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
              >
                <path d="M12 2v20M2 12h20" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>
            <h3>Eco-Friendly</h3>
            <p>
              Reclaimed and sustainably sourced timber, plastic-free packaging.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="eyebrow center">Kind Words</div>
        <h2 class="serif center">Customer Reviews</h2>
        <div class="grid tgrid">
          <div class="card tcard">
            <div class="stars">★★★★★</div>
            <p>
              "The board is the first thing my guests notice. Beautiful grain,
              held up to two years of daily use."
            </p>
            <div class="who">— Nadeesha P., Colombo</div>
          </div>
          <div class="card tcard">
            <div class="stars">★★★★★</div>
            <p>
              "Bought as a wedding gift — packaging and finish felt genuinely
              premium."
            </p>
            <div class="who">— Kasun R., Kandy</div>
          </div>
          <div class="card tcard">
            <div class="stars">★★★★☆</div>
            <p>
              "Fast island-wide shipping and the board smelled of fresh wood
              oil. Lovely touch."
            </p>
            <div class="who">— Ishara D., Galle</div>
          </div>
        </div>
      </div>
    </section>

    <div class="promo">
      <div class="wrap">
        <h2 class="serif">Get 10% Off Your First Order</h2>
        <p>Use the code below at checkout</p>
        <span class="code">LEECRAFT10</span>
        <button class="btn btn-outline-light" routerLink="/shop">
          Shop Now
        </button>
      </div>
    </div>

    <div class="newsletter">
      <div class="wrap">
        <div class="eyebrow">Stay In Touch</div>
        <h2 class="serif">Join Our Newsletter</h2>
        <p>New pieces, workshop stories and offers — straight to your inbox.</p>
        <form class="nform" #nlForm="ngForm" (ngSubmit)="subscribe(nlForm)">
          <input
            type="email"
            name="email"
            ngModel
            required
            placeholder="Your email address"
          />
          <button type="submit">Join</button>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .hero {
        position: relative;
        height: 560px;
        display: flex;
        align-items: center;
        overflow: hidden;
        background: var(--wood-800);
      }
      .hero .bg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
      .hero .overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          rgba(30, 18, 10, 0.8) 0%,
          rgba(30, 18, 10, 0.58) 45%,
          rgba(30, 18, 10, 0.28) 100%
        );
      }
      .hero .content {
        position: relative;
        z-index: 1;
        max-width: 560px;
      }
      .hero h1 {
        font-size: 50px;
        line-height: 1.1;
        color: #fff;
        margin: 16px 0 18px;
        font-weight: 500;
        font-family: 'Fraunces', 'Georgia', serif;
        text-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
      }
      .hero p {
        font-size: 16px;
        line-height: 1.7;
        color: #f0e4d6;
        margin: 0 0 30px;
        max-width: 440px;
      }
      .hero .eyebrow.light {
        color: #e7c9a8;
      }
      .hero-actions {
        display: flex;
        gap: 14px;
      }
      .hero-anim {
        opacity: 0;
        transform: translate3d(0, 26px, 0);
        animation: heroIn 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
      }
      .hero-anim.d1 {
        animation-delay: 0.05s;
      }
      .hero-anim.d2 {
        animation-delay: 0.18s;
      }
      .hero-anim.d3 {
        animation-delay: 0.3s;
      }
      .hero-anim.d4 {
        animation-delay: 0.42s;
      }
      @keyframes heroIn {
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }

      .intro {
        max-width: 680px;
        margin: 0 auto 48px;
      }
      .intro h2 {
        font-size: 32px;
        font-weight: 500;
        margin: 14px 0 12px;
      }
      .intro p {
        font-size: 14.5px;
        line-height: 1.8;
        color: var(--wood-700);
      }

      .top-flush {
        padding-top: 0;
      }
      .center {
        text-align: center;
        display: block;
      }
      h2.serif.center {
        font-size: 30px;
        font-weight: 500;
        margin: 12px 0 40px;
      }

      .pgrid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
      .pcard {
        display: flex;
        flex-direction: column;
      }
      .thumb {
        position: relative;
        height: 200px;
        overflow: hidden;
        background: var(--cream-2);
      }
      .thumb-fallback {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, var(--wood-200), var(--wood-400));
      }
      .body {
        padding: 16px 4px;
      }
      .pname {
        font-size: 15.5px;
        font-weight: 500;
        margin: 0 0 6px;
      }
      .pmeta {
        font-size: 12px;
        color: var(--wood-400);
        margin-bottom: 8px;
      }
      .prow {
        display: flex;
        align-items: center;
        gap: 14px;
       
      }
      .price {
        font-size: 15px;
        font-weight: 600;
      }
      .addbtn {
        border: 1px solid var(--wood-800);
        background: transparent;
        font-size: 11px;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        padding: 7px 10px;
        border-radius: 2px;
        cursor: pointer;
      }
      .addbtn:hover {
        background: var(--wood-800);
        color: #fff;
      }

      .shaded {
        background: var(--cream-2);
      }
      .why-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
      .why-item {
        text-align: center;
        padding: 8px;
      }
      .why-item .ic {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: var(--cream-2);
        color: var(--wood-500);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
      }
      .shaded .why-item .ic {
        background: #fff;
      }
      .why-item h3 {
        font-size: 17px;
        margin: 0 0 8px;
        font-weight: 500;
      }
      .why-item p {
        font-size: 13.5px;
        color: var(--wood-700);
        line-height: 1.6;
        margin: 0;
      }

      .tgrid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      .tcard {
        padding: 28px 24px;
      }
      .tcard p {
        font-size: 15px;
        line-height: 1.7;
        font-style: italic;
        font-family: 'Fraunces', serif;
        color: #4a3826;
        margin: 12px 0 16px;
      }
      .tcard .who {
        font-size: 12.5px;
        color: var(--wood-400);
      }

      .promo {
        background: var(--wood-800);
        color: #fff;
        padding: 44px 0;
        text-align: center;
      }
      .promo h2 {
        color: #fff;
        font-size: 28px;
        margin: 0 0 10px;
        font-weight: 500;
      }
      .promo p {
        color: var(--wood-200);
        margin: 0 0 22px;
        font-size: 14px;
      }
      .promo .code {
        background: rgba(255, 255, 255, 0.12);
        border: 1px dashed var(--wood-200);
        padding: 8px 18px;
        border-radius: 3px;
        font-size: 14px;
        letter-spacing: 2px;
        margin-right: 14px;
      }

      .newsletter {
        background: var(--cream-2);
        padding: 56px 0;
        text-align: center;
      }
      .newsletter h2 {
        font-size: 26px;
        font-weight: 500;
        margin: 12px 0 4px;
      }
      .newsletter p {
        font-size: 13.5px;
        color: var(--wood-700);
      }
      .nform {
        display: flex;
        max-width: 420px;
        margin: 20px auto 0;
        border: 1px solid var(--wood-700);
      }
      .nform input {
        flex: 1;
        border: none;
        background: transparent;
        padding: 13px 16px;
        font-size: 13px;
        outline: none;
      }
      .nform button {
        background: var(--wood-500);
        color: #fff;
        border: none;
        padding: 0 22px;
        font-size: 12px;
        letter-spacing: 1px;
        text-transform: uppercase;
        cursor: pointer;
      }

      @media (max-width: 860px) {
        .hero h1 {
          font-size: 34px;
        }
        .pgrid,
        .why-grid,
        .tgrid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  private readonly notify = inject(NotificationService);
  private readonly productService = inject(ProductService);

  protected readonly featured = signal<Product[]>([]);

  ngOnInit(): void {
    this.productService.list().subscribe({
      next: (products) => {
        // Show first 4 products from the backend
        this.featured.set(products.slice(0, 4));
      },
      error: (error) => {
        console.error('Failed to load featured products:', error);
      },
    });
  }

  subscribe(form: any): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    this.notify.success('Thanks for subscribing!');
    form.resetForm();
  }
}
