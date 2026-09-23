import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="wrap section center" style="max-width:520px;">
      <div style="width:70px;height:70px;background:var(--cream-2);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <h1 class="serif" style="font-size:28px;font-weight:500;">Thank You For Your Order</h1>
      <p style="color:var(--wood-700);font-size:14.5px;">
        Your order <strong>#{{ orderId }}</strong> has been placed. Our team will contact you shortly via your
        preferred contact method to confirm details and arrange payment.
      </p>
      <div style="display:flex;gap:12px;justify-content:center;margin-top:24px;flex-wrap:wrap;">
        <a [routerLink]="['/track-order']" [queryParams]="{ orderNumber: orderId }" class="btn btn-outline">
          🚚 Track Order Status
        </a>
        <a routerLink="/shop" class="btn btn-primary">Continue Shopping</a>
      </div>
    </div>
  `,
})
export class OrderConfirmationComponent {
  private route = inject(ActivatedRoute);
  orderId = this.route.snapshot.paramMap.get('id');
}
