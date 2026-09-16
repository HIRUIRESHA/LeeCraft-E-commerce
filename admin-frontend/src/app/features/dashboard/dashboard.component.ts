import { Component } from '@angular/core';
import { AdminProduct } from './dashboard.model';

const SEED_PRODUCTS: AdminProduct[] = [
  { id: 'bamboo-eco-board', name: 'Bamboo Eco Board', price: 2200, size: 'Small', material: 'Bamboo', shape: 'Rectangle', color: 'Light Tan', inStock: true, reviewCount: 88, description: 'A lightweight, sustainably grown bamboo board for everyday prep.', image: null },
  { id: 'walnut-carving-board', name: 'Walnut Carving Board', price: 6800, size: 'Large', material: 'Walnut', shape: 'Rectangle', color: 'Dark Brown', inStock: true, reviewCount: 64, description: 'A substantial carving board with a juice groove.', image: null },
  { id: 'rosewood-cleaver-board', name: 'Rosewood Cleaver Board', price: 5200, size: 'Medium', material: 'Rosewood', shape: 'Round', color: 'Espresso', inStock: false, reviewCount: 41, description: 'Dense, cleaver-safe rosewood in a round profile.', image: null },
  { id: 'teak-everyday-board', name: 'Teak Everyday Board', price: 3400, size: 'Medium', material: 'Teak', shape: 'Rectangle', color: 'Golden Brown', inStock: true, reviewCount: 120, description: 'The everyday board — teak, oiled, ready to use.', image: null },
];

const ORDER_COUNT = 5;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <main class="wrap section">
      <div class="eyebrow">Admin</div>
      <h1 class="serif" style="font-size:30px;font-weight:500;margin:10px 0 16px;">Store Dashboard</h1>

      <section>
        <div class="grid admin-grid" style="margin-bottom:40px;">
          <div class="card stat-card"><div class="num">Rs. 486,200</div><div class="lbl">Total Sales (30d)</div></div>
          <div class="card stat-card"><div class="num">{{ products.length }}</div><div class="lbl">Products</div></div>
          <div class="card stat-card"><div class="num">{{ orderCount }}</div><div class="lbl">Orders</div></div>
          <div class="card stat-card"><div class="num">27</div><div class="lbl">Abandoned Carts</div></div>
        </div>
        <div class="grid" style="grid-template-columns:1fr 1fr;gap:24px;">
          <div class="card" style="padding:22px;">
            <h3 style="margin-top:0;font-size:15px;">Best-Selling Boards</h3>
            @for (p of bestSellers; track p.id) {
              <div style="display:flex;justify-content:space-between;font-size:13.5px;padding:8px 0;border-bottom:1px solid var(--line);">
                <span>{{ p.name }}</span><span style="color:var(--wood-400);">{{ p.reviewCount }} reviews</span>
              </div>
            }
          </div>
          <div class="card" style="padding:22px;">
            <h3 style="margin-top:0;font-size:15px;">Top Chatbot Questions</h3>
            <p style="font-size:13.5px;color:var(--wood-700);">
              "Is this dishwasher safe?" &middot; "Which board is best for meat?" &middot; "Where is my order?"
              &middot; "Do you deliver to Colombo?" &middot; "What sizes are available?"
            </p>
          </div>
        </div>
      </section>
    </main>
  `,
})
export class DashboardComponent {
  readonly products = SEED_PRODUCTS;
  readonly orderCount = ORDER_COUNT;
  readonly bestSellers = [...SEED_PRODUCTS].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4);
}
