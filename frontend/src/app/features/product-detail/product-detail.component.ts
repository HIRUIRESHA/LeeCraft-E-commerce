import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { Product, ProductReviewSummary, Review } from '../../core/models/product.model';
import { ProductCardComponent } from '../shop/product-card.component';
import { woodSwatch } from '../../core/utils/wood-swatch';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, DatePipe, ProductCardComponent],
  template: `
    @if (product(); as p) {
      <div class="wrap section">
        <div class="pd-layout">
          <!-- Gallery -->
          <div class="pd-gallery">
            <div
              class="main-img"
              [style.background]="p.image ? null : swatch(p.color)"
            >
              @if (p.image) {
                <img [src]="p.image" [alt]="p.name" />
              }
            </div>
          </div>

          <!-- Info & Actions -->
          <div class="pd-info">
            <div class="eyebrow">
              {{ p.material }} &middot; {{ p.size }} &middot;
              {{ p.shape }} &middot; {{ p.color }}
            </div>

            <h1 class="serif" style="margin-bottom:8px;">{{ p.name }}</h1>

            <!-- Star Rating Header Link -->
            <div class="rating-header-link" (click)="scrollToReviews()">
              <span class="stars-gold">{{ getStarString(p.rating) }}</span>
              <span class="rating-val">{{ p.rating > 0 ? (p.rating | number:'1.1-1') : 'New' }}</span>
              <span class="rating-count">({{ p.reviewCount }} {{ p.reviewCount === 1 ? 'review' : 'reviews' }})</span>
              <span class="write-link">&bull; Write a review</span>
            </div>

            <div class="pd-price" style="margin-top:14px;">
              <span class="now">Rs. {{ p.price | number }}</span>
              @if (p.oldPrice) {
                <span class="old">Rs. {{ p.oldPrice | number }}</span>
              }
            </div>

            <p class="pd-desc-short">{{ p.description }}</p>

            <ul class="pd-specs">
              <li><strong>Material:</strong> {{ p.material }}</li>
              <li><strong>Size:</strong> {{ p.size }}</li>
              <li><strong>Shape:</strong> {{ p.shape }}</li>
              <li><strong>Color:</strong> {{ p.color }}</li>
            </ul>

            <div class="qty-row">
              <div class="qty-stepper">
                <button type="button" (click)="qty.set(Math.max(1, qty() - 1))">
                  &minus;
                </button>
                <span>{{ qty() }}</span>
                <button type="button" (click)="qty.set(qty() + 1)">+</button>
              </div>
              <span style="font-size:12.5px;color:var(--wood-400);">
                {{ p.inStock ? 'In Stock' : 'Out of Stock' }}
              </span>
            </div>

            <div class="pd-actions">
              <button
                class="btn btn-primary"
                style="flex:1;"
                [disabled]="!p.inStock"
                (click)="addToCart(p)"
              >
                {{ p.inStock ? 'Add to Cart' : 'Out of Stock' }}
              </button>
              <button
                class="btn btn-outline"
                style="flex:1;"
                [disabled]="!p.inStock"
                (click)="buyNow(p)"
              >
                Buy Now
              </button>
            </div>

            <!-- Direct WhatsApp Inquire Button -->
            <a
              [href]="whatsAppInquiryLink(p)"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-whatsapp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.83a8.17 8.17 0 0 1-5.82 2.41c-1.47 0-2.91-.39-4.17-1.14l-.3-.18-3.1 1.01.83-3.02-.2-.31a8.196 8.196 0 0 1-1.26-4.35c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.32-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.3"/>
              </svg>
              Quick Inquiry on WhatsApp
            </a>

            <!-- Social Share Bar -->
            <div class="share-bar">
              <span class="share-label">Share this craft:</span>
              <a [href]="whatsAppShareLink(p)" target="_blank" rel="noopener noreferrer" class="share-icon-btn whatsapp" title="Share via WhatsApp">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.83a8.17 8.17 0 0 1-5.82 2.41c-1.47 0-2.91-.39-4.17-1.14l-.3-.18-3.1 1.01.83-3.02-.2-.31a8.196 8.196 0 0 1-1.26-4.35c0-4.54 3.7-8.24 8.24-8.24"/>
                </svg>
              </a>
              <a [href]="facebookShareLink()" target="_blank" rel="noopener noreferrer" class="share-icon-btn fb" title="Share on Facebook">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <button type="button" class="share-icon-btn copy" (click)="copyPageUrl()" title="Copy Link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </button>
              @if (copiedToClipboard()) {
                <span class="copied-msg">Link copied!</span>
              }
            </div>

            <div class="trust-row">
              <div class="item">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--wood-500)" stroke-width="1.6" style="flex-shrink:0;">
                  <rect x="1" y="3" width="15" height="13" />
                  <path d="M16 8h4l3 3v5h-7z" />
                  <circle cx="5.5" cy="18.5" r="2" />
                  <circle cx="18.5" cy="18.5" r="2" />
                </svg>
                Island-wide delivery, 3&ndash;5 working days
              </div>
              <div class="item">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--wood-500)" stroke-width="1.6" style="flex-shrink:0;">
                  <path d="M3 12a9 9 0 1 0 9-9" />
                  <path d="M3 12h9V3" />
                </svg>
                7-day return &amp; refund policy
              </div>
              <div class="item">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--wood-500)" stroke-width="1.6" style="flex-shrink:0;">
                  <rect x="4" y="10" width="16" height="10" rx="1" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                We'll contact you to confirm payment
              </div>
              <div class="item">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--wood-500)" stroke-width="1.6" style="flex-shrink:0;">
                  <path d="M12 2 3 7v6c0 5 4 8 9 9 5-1 9-4 9-9V7z" />
                </svg>
                1-year workmanship warranty
              </div>
            </div>
          </div>
        </div>

        <!-- ================= REVIEWS SECTION ================= -->
        <div id="reviews-section" class="reviews-wrapper">
          <div class="reviews-header">
            <div>
              <div class="eyebrow">Feedback &amp; Ratings</div>
              <h2 class="serif" style="font-size:26px;margin:4px 0 0;">Customer Reviews</h2>
            </div>
            <button
              type="button"
              class="btn btn-outline btn-sm"
              (click)="showReviewForm.set(!showReviewForm())"
            >
              {{ showReviewForm() ? 'Cancel Review' : 'Write a Review' }}
            </button>
          </div>

          <!-- Review Summary Breakdown Card -->
          <div class="review-stats-card">
            <div class="stats-overall">
              <div class="big-score">{{ p.rating > 0 ? (p.rating | number:'1.1-1') : '0.0' }}</div>
              <div class="stars-gold-big">{{ getStarString(p.rating) }}</div>
              <div class="based-on">Based on {{ p.reviewCount }} {{ p.reviewCount === 1 ? 'review' : 'reviews' }}</div>
            </div>

            <div class="stats-bars">
              @for (star of [5, 4, 3, 2, 1]; track star) {
                <div class="bar-row">
                  <span class="bar-label">{{ star }}★</span>
                  <div class="bar-track">
                    <div
                      class="bar-fill"
                      [style.width.%]="getDistributionPct(star)"
                    ></div>
                  </div>
                  <span class="bar-count">{{ getDistributionCount(star) }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Write Review Form -->
          @if (showReviewForm()) {
            <form class="write-review-form" (ngSubmit)="submitReview(p.id)">
              <h3 style="margin-top:0;font-size:18px;">Share your experience</h3>

              <!-- Interactive Star Selector -->
              <div class="field">
                <label>Overall Rating *</label>
                <div class="interactive-stars">
                  @for (s of [1, 2, 3, 4, 5]; track s) {
                    <button
                      type="button"
                      class="star-btn"
                      [class.active]="s <= reviewForm.rating"
                      (click)="reviewForm.rating = s"
                      [title]="s + ' stars'"
                    >
                      ★
                    </button>
                  }
                  <span class="star-rating-text">{{ reviewForm.rating }} of 5 Stars</span>
                </div>
              </div>

              <div class="form-row">
                <div class="field">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    required
                    [(ngModel)]="reviewForm.reviewerName"
                    name="reviewerName"
                    placeholder="e.g. Priyantha Fernando"
                  />
                </div>
                <div class="field">
                  <label>Email Address (Optional)</label>
                  <input
                    type="email"
                    [(ngModel)]="reviewForm.reviewerEmail"
                    name="reviewerEmail"
                    placeholder="Used to verify your purchase"
                  />
                  <small style="color:var(--wood-500);font-size:11px;">Matches previous orders for a Verified Buyer badge</small>
                </div>
              </div>

              <div class="field">
                <label>Review &amp; Feedback *</label>
                <textarea
                  rows="4"
                  required
                  [(ngModel)]="reviewForm.comment"
                  name="comment"
                  placeholder="Tell us what you love about this craft, finish quality, durability..."
                ></textarea>
              </div>

              @if (reviewError()) {
                <div class="review-error">{{ reviewError() }}</div>
              }

              <button
                type="submit"
                class="btn btn-primary btn-sm"
                [disabled]="isSubmittingReview() || !reviewForm.reviewerName.trim() || !reviewForm.comment.trim()"
              >
                {{ isSubmittingReview() ? 'Submitting...' : 'Post Review' }}
              </button>
            </form>
          }

          @if (reviewSuccess()) {
            <div class="review-success-banner">
              ✓ Thank you! Your review has been submitted and posted.
            </div>
          }

          <!-- Reviews List -->
          <div class="reviews-list">
            @if (reviewsList().length > 0) {
              @for (rev of reviewsList(); track rev.id) {
                <div class="review-item">
                  <div class="review-top">
                    <div class="reviewer-meta">
                      <div class="reviewer-avatar">
                        {{ rev.reviewerName ? rev.reviewerName.charAt(0).toUpperCase() : 'U' }}
                      </div>
                      <div>
                        <div class="reviewer-name">
                          {{ rev.reviewerName }}
                          @if (rev.verifiedPurchase) {
                            <span class="verified-tag">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                              </svg>
                              Verified Buyer
                            </span>
                          }
                        </div>
                        <div class="review-date">{{ rev.createdAt | date:'mediumDate' }}</div>
                      </div>
                    </div>
                    <div class="review-stars-gold">{{ getStarString(rev.rating) }}</div>
                  </div>
                  <p class="review-comment">{{ rev.comment }}</p>
                </div>
              }
            } @else {
              <div class="no-reviews-box">
                <p>No reviews yet for this piece. Be the first to share your experience!</p>
              </div>
            }
          </div>
        </div>

        <!-- ================= RELATED PRODUCTS ================= -->
        @if (relatedProducts().length > 0) {
          <div class="related-wrapper">
            <div class="eyebrow">Recommendations</div>
            <h2 class="serif" style="font-size:26px;margin:4px 0 24px;">You May Also Like</h2>

            <div class="grid pgrid">
              @for (rel of relatedProducts(); track rel.id) {
                <app-product-card [product]="rel" />
              }
            </div>
          </div>
        }
      </div>
    } @else {
      <p class="center" style="padding:80px 0;color:var(--wood-700);">
        Loading product details...
      </p>
    }
  `,
  styles: [`
    .rating-header-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13.5px;
      cursor: pointer;
      color: var(--wood-700);
      margin-top: 4px;
    }
    .rating-header-link:hover .write-link {
      text-decoration: underline;
      color: var(--wood-900);
    }
    .stars-gold { color: #d97706; font-size: 15px; letter-spacing: 1px; }
    .stars-gold-big { color: #d97706; font-size: 22px; letter-spacing: 2px; }
    .rating-val { font-weight: 700; color: var(--wood-900); }
    .rating-count { color: var(--wood-500); }
    .write-link { color: var(--wood-600); font-size: 12.5px; }

    /* WhatsApp Button */
    .btn-whatsapp {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #25d366;
      color: #fff !important;
      font-size: 13.5px;
      font-weight: 600;
      padding: 10px 16px;
      border-radius: 6px;
      text-decoration: none;
      margin-top: 12px;
      transition: background 0.2s ease, transform 0.1s ease;
    }
    .btn-whatsapp:hover {
      background: #1ebd5a;
      transform: translateY(-1px);
    }

    /* Social Share Bar */
    .share-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 16px;
      padding-top: 14px;
      border-top: 1px solid var(--line, #e2d9cf);
    }
    .share-label {
      font-size: 12.5px;
      font-weight: 500;
      color: var(--wood-600);
    }
    .share-icon-btn {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--line, #e2d9cf);
      background: #fff;
      color: var(--wood-700);
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .share-icon-btn.whatsapp:hover { background: #25d366; color: #fff; border-color: #25d366; }
    .share-icon-btn.fb:hover { background: #1877f2; color: #fff; border-color: #1877f2; }
    .share-icon-btn.copy:hover { background: var(--wood-800); color: #fff; border-color: var(--wood-800); }
    .copied-msg { font-size: 12px; color: #16a34a; font-weight: 600; }

    /* Reviews Section */
    .reviews-wrapper {
      margin-top: 60px;
      padding-top: 40px;
      border-top: 1px solid var(--line, #e2d9cf);
    }
    .reviews-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 24px;
    }
    .review-stats-card {
      display: flex;
      gap: 40px;
      align-items: center;
      background: #fff;
      border: 1px solid var(--line, #e2d9cf);
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 30px;
    }
    .stats-overall {
      text-align: center;
      min-width: 140px;
      border-right: 1px solid var(--line, #e2d9cf);
      padding-right: 30px;
    }
    .big-score { font-size: 42px; font-weight: 700; color: var(--wood-900); line-height: 1; }
    .based-on { font-size: 12px; color: var(--wood-500); margin-top: 4px; }
    .stats-bars { flex: 1; display: flex; flex-direction: column; gap: 6px; }
    .bar-row { display: flex; align-items: center; gap: 10px; font-size: 12.5px; }
    .bar-label { width: 24px; color: var(--wood-700); font-weight: 500; }
    .bar-track { flex: 1; height: 8px; background: #f0ebe4; border-radius: 4px; overflow: hidden; }
    .bar-fill { height: 100%; background: #d97706; border-radius: 4px; }
    .bar-count { width: 30px; text-align: right; color: var(--wood-500); font-size: 11.5px; }

    /* Review Form */
    .write-review-form {
      background: var(--cream, #fcf9f5);
      border: 1px solid var(--line, #e2d9cf);
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 30px;
    }
    .interactive-stars { display: flex; align-items: center; gap: 4px; margin-top: 6px; }
    .star-btn {
      background: none;
      border: none;
      font-size: 26px;
      color: #d1d5db;
      cursor: pointer;
      padding: 0;
      transition: color 0.15s ease;
      line-height: 1;
    }
    .star-btn.active { color: #d97706; }
    .star-rating-text { font-size: 13px; font-weight: 600; color: var(--wood-700); margin-left: 10px; }
    .write-review-form .form-row { display: flex; gap: 16px; margin: 12px 0; }
    .write-review-form .field { flex: 1; margin-bottom: 12px; }
    .write-review-form label { display: block; font-size: 12.5px; font-weight: 600; color: var(--wood-800); margin-bottom: 4px; }
    .write-review-form input, .write-review-form textarea {
      width: 100%;
      padding: 8px 12px;
      font-size: 13.5px;
      border: 1px solid var(--line, #e2d9cf);
      border-radius: 6px;
      box-sizing: border-box;
      font-family: inherit;
    }
    .review-error { color: var(--danger, #dc2626); font-size: 12.5px; margin-bottom: 12px; }
    .review-success-banner {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #166534;
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 13.5px;
      margin-bottom: 24px;
      font-weight: 500;
    }

    /* Review Items */
    .reviews-list { display: flex; flex-direction: column; gap: 16px; }
    .review-item {
      background: #fff;
      border: 1px solid var(--line, #e2d9cf);
      border-radius: 8px;
      padding: 18px 20px;
    }
    .review-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .reviewer-meta { display: flex; align-items: center; gap: 12px; }
    .reviewer-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--wood-700);
      color: #fff;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
    .reviewer-name { font-size: 14px; font-weight: 600; color: var(--wood-900); display: flex; align-items: center; gap: 8px; }
    .verified-tag {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      background: #ecfdf5;
      color: #059669;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 7px;
      border-radius: 4px;
      border: 1px solid #a7f3d0;
    }
    .review-date { font-size: 12px; color: var(--wood-500); margin-top: 2px; }
    .review-stars-gold { color: #d97706; font-size: 14px; letter-spacing: 1px; }
    .review-comment { margin-top: 10px; font-size: 13.5px; color: var(--wood-800); line-height: 1.5; }
    .no-reviews-box {
      text-align: center;
      padding: 40px;
      background: #faf8f5;
      border: 1px dashed var(--line);
      border-radius: 8px;
      color: var(--wood-600);
      font-size: 14px;
    }

    /* Related Products */
    .related-wrapper {
      margin-top: 60px;
      padding-top: 40px;
      border-top: 1px solid var(--line, #e2d9cf);
    }

    @media (max-width: 768px) {
      .review-stats-card { flex-direction: column; align-items: stretch; gap: 20px; }
      .stats-overall { border-right: none; border-bottom: 1px solid var(--line); padding-right: 0; padding-bottom: 20px; }
      .write-review-form .form-row { flex-direction: column; gap: 0; }
    }
  `],
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | undefined>(undefined);
  relatedProducts = signal<Product[]>([]);
  reviewsList = signal<Review[]>([]);
  reviewSummary = signal<ProductReviewSummary | null>(null);

  qty = signal(1);
  showReviewForm = signal(false);
  isSubmittingReview = signal(false);
  reviewSuccess = signal(false);
  reviewError = signal<string | null>(null);
  copiedToClipboard = signal(false);

  reviewForm = {
    rating: 5,
    reviewerName: '',
    reviewerEmail: '',
    comment: '',
  };

  Math = Math;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly products = inject(ProductService);
  private readonly cart = inject(CartService);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (!idParam) return;

      const id = Number(idParam);
      this.loadProductDetails(id);
    });
  }

  loadProductDetails(id: number): void {
    this.qty.set(1);
    this.showReviewForm.set(false);
    this.reviewSuccess.set(false);
    this.reviewError.set(null);

    // Fetch primary product
    this.products.get(id).subscribe({
      next: (product) => {
        this.product.set(product);
        // Scroll to top upon loading product
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {
        console.error('Failed to load product:', error);
        this.product.set(undefined);
      },
    });

    // Fetch reviews
    this.products.getReviews(id).subscribe({
      next: (summary) => {
        this.reviewSummary.set(summary);
        this.reviewsList.set(summary.reviews);
      },
      error: (err) => {
        console.warn('Could not load reviews:', err);
      },
    });

    // Fetch related products
    this.products.getRelated(id).subscribe({
      next: (related) => {
        this.relatedProducts.set(related);
      },
      error: (err) => {
        console.warn('Could not load related products:', err);
      },
    });
  }

  addToCart(product: Product): void {
    this.cart.addToCart(product, this.qty());
  }

  buyNow(product: Product): void {
    this.cart.addToCart(product, this.qty());
    this.router.navigate(['/checkout']);
  }

  swatch(color: string): string {
    return woodSwatch(color);
  }

  scrollToReviews(): void {
    const el = document.getElementById('reviews-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getStarString(rating: number): string {
    const r = Math.round(rating || 0);
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  }

  getDistributionCount(star: number): number {
    const summary = this.reviewSummary();
    if (!summary || !summary.ratingDistribution) return 0;
    return summary.ratingDistribution[star] || 0;
  }

  getDistributionPct(star: number): number {
    const summary = this.reviewSummary();
    if (!summary || summary.totalReviews === 0) return 0;
    const count = this.getDistributionCount(star);
    return Math.round((count / summary.totalReviews) * 100);
  }

  submitReview(productId: number): void {
    if (!this.reviewForm.reviewerName.trim() || !this.reviewForm.comment.trim()) {
      this.reviewError.set('Please fill out all required fields.');
      return;
    }

    this.isSubmittingReview.set(true);
    this.reviewError.set(null);

    this.products
      .addReview(productId, {
        reviewerName: this.reviewForm.reviewerName.trim(),
        reviewerEmail: this.reviewForm.reviewerEmail ? this.reviewForm.reviewerEmail.trim() : undefined,
        rating: this.reviewForm.rating,
        comment: this.reviewForm.comment.trim(),
      })
      .subscribe({
        next: (created) => {
          this.isSubmittingReview.set(false);
          this.reviewSuccess.set(true);
          this.showReviewForm.set(false);
          this.reviewsList.update((list) => [created, ...list]);

          // Refresh review summary & product rating
          this.products.getReviews(productId).subscribe((s) => {
            this.reviewSummary.set(s);
            this.product.update((curr) => {
              if (!curr) return curr;
              return {
                ...curr,
                rating: s.averageRating,
                reviewCount: s.totalReviews,
              };
            });
          });

          // Reset form
          this.reviewForm = {
            rating: 5,
            reviewerName: '',
            reviewerEmail: '',
            comment: '',
          };
        },
        error: (err) => {
          this.isSubmittingReview.set(false);
          this.reviewError.set(err.error?.message || 'Failed to submit review. Please try again.');
        },
      });
  }

  whatsAppInquiryLink(p: Product): string {
    const url = window.location.href;
    const msg = `Hi LeeCraft, I have an inquiry regarding "${p.name}" (Rs. ${p.price}). Could you provide more details? ${url}`;
    return `https://wa.me/94771234567?text=${encodeURIComponent(msg)}`;
  }

  whatsAppShareLink(p: Product): string {
    const url = window.location.href;
    const msg = `Check out this handcrafted piece from LeeCraft: ${p.name} - ${url}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  }

  facebookShareLink(): string {
    const url = encodeURIComponent(window.location.href);
    return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  }

  copyPageUrl(): void {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.copiedToClipboard.set(true);
        setTimeout(() => this.copiedToClipboard.set(false), 2500);
      });
    }
  }
}
