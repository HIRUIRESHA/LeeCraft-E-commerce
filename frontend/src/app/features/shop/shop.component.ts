import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from './product-card.component';

type SortOption = 'best' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

const PRICE_RANGES = [
  { label: 'Under Rs. 3,000', min: 0, max: 3000 },
  { label: 'Rs. 3,000 – 5,000', min: 3000, max: 5000 },
  { label: 'Rs. 5,000 – 10,000', min: 5000, max: 10000 },
  { label: 'Above Rs. 10,000', min: 10000, max: Infinity },
];

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [FormsModule, ProductCardComponent],
  template: `
    <div class="wrap section">
      <div class="eyebrow">Shop</div>
      <h1
        class="serif"
        style="font-size:32px;font-weight:500;margin:10px 0 30px;"
      >
        All Cutting Boards & Crafts
      </h1>

      <div class="shop-layout">
        <aside class="filters">
          <div class="fgroup">
            <h4>Price</h4>
            @for (range of priceRanges; track range.label) {
              <label>
                <input
                  type="checkbox"
                  [checked]="selectedPriceRanges().includes(range.label)"
                  (change)="togglePriceRange(range.label)"
                />
                {{ range.label }}
              </label>
            }
          </div>
          <div class="fgroup">
            <h4>Material</h4>
            @for (material of facet('material'); track material) {
              <label>
                <input
                  type="checkbox"
                  [checked]="selectedMaterials().includes(material)"
                  (change)="toggle(selectedMaterials, material)"
                />
                {{ material }}
              </label>
            }
          </div>
          <div class="fgroup">
            <h4>Size</h4>
            @for (size of facet('size'); track size) {
              <label>
                <input
                  type="checkbox"
                  [checked]="selectedSizes().includes(size)"
                  (change)="toggle(selectedSizes, size)"
                />
                {{ size }}
              </label>
            }
          </div>
          <div class="fgroup">
            <h4>Shape</h4>
            @for (shape of facet('shape'); track shape) {
              <label>
                <input
                  type="checkbox"
                  [checked]="selectedShapes().includes(shape)"
                  (change)="toggle(selectedShapes, shape)"
                />
                {{ shape }}
              </label>
            }
          </div>
          <div class="fgroup">
            <h4>Color</h4>
            @for (color of facet('color'); track color) {
              <label>
                <input
                  type="checkbox"
                  [checked]="selectedColors().includes(color)"
                  (change)="toggle(selectedColors, color)"
                />
                {{ color }}
              </label>
            }
          </div>
          <div class="fgroup" style="border-bottom:none;">
            <h4>Availability</h4>
            <label>
              <input
                type="checkbox"
                [checked]="inStockOnly()"
                (change)="inStockOnly.set(!inStockOnly())"
              />
              In Stock Only
            </label>
          </div>
          <button
            class="btn btn-outline btn-block btn-sm"
            (click)="clearFilters()"
          >
            Clear Filters
          </button>
        </aside>

        <div>
          <div class="shop-top">
            <div class="searchbox">
              <input
                type="text"
                [value]="query()"
                (input)="query.set($any($event.target).value)"
                placeholder="Search cutting boards & crafts..."
              />
              <button type="button">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </div>
            <div class="sortbox">
              <select [ngModel]="sort()" (ngModelChange)="sort.set($event)">
                <option value="best">Sort: Best Selling</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
          <div class="resultcount">{{ filtered().length }} results</div>
          <div class="grid pgrid">
            @for (p of filtered(); track p.id) {
              <app-product-card [product]="p" />
            } @empty {
              <p style="color:var(--wood-700);font-size:13.5px;">
                No boards match your filters.
              </p>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ShopComponent implements OnInit {
  private all = signal<Product[]>([]);
  priceRanges = PRICE_RANGES;

  query = signal('');
  sort = signal<SortOption>('best');
  selectedPriceRanges = signal<string[]>([]);
  selectedMaterials = signal<string[]>([]);
  selectedSizes = signal<string[]>([]);
  selectedShapes = signal<string[]>([]);
  selectedColors = signal<string[]>([]);
  inStockOnly = signal(false);

  filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const priceLabels = this.selectedPriceRanges();
    const materials = this.selectedMaterials();
    const sizes = this.selectedSizes();
    const shapes = this.selectedShapes();
    const colors = this.selectedColors();

    const list = this.all().filter((p) => {
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !p.material.toLowerCase().includes(q)
      )
        return false;
      if (this.inStockOnly() && !p.inStock) return false;
      if (materials.length && !materials.includes(p.material)) return false;
      if (sizes.length && !sizes.includes(p.size)) return false;
      if (shapes.length && !shapes.includes(p.shape)) return false;
      if (colors.length && !colors.includes(p.color)) return false;
      if (priceLabels.length) {
        const ranges = PRICE_RANGES.filter((r) =>
          priceLabels.includes(r.label),
        );
        if (!ranges.some((r) => p.price >= r.min && p.price < r.max))
          return false;
      }
      return true;
    });

    switch (this.sort()) {
      case 'price-asc':
        return [...list].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...list].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...list].sort(
          (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
        );
      case 'newest':
        return [...list].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
      default:
        return [...list].sort((a, b) => b.reviewCount - a.reviewCount);
    }
  });

  constructor(
    private products: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const keyword = params.get('keyword');
      if (keyword !== null) {
        this.query.set(keyword);
      }
    });

    this.products.list().subscribe({
      next: (list) => {
        this.all.set(list);
      },
      error: (error) => {
        console.error('Failed to load products:', error);
      },
    });
  }

  facet(key: 'material' | 'size' | 'shape' | 'color'): string[] {
    return Array.from(new Set(this.all().map((p) => p[key]))).sort();
  }

  toggle(sig: ReturnType<typeof signal<string[]>>, value: string): void {
    sig.update((list) =>
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    );
  }

  togglePriceRange(label: string): void {
    this.toggle(this.selectedPriceRanges, label);
  }

  clearFilters(): void {
    this.query.set('');
    this.selectedPriceRanges.set([]);
    this.selectedMaterials.set([]);
    this.selectedSizes.set([]);
    this.selectedShapes.set([]);
    this.selectedColors.set([]);
    this.inStockOnly.set(false);
  }
}
