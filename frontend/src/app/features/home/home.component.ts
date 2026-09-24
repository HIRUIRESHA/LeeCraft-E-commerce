import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { ProductService } from '../../core/services/product.service';
import { Product, Review, StoreReviewSummary } from '../../core/models/product.model';
import { BannerService, Banner } from '../../core/services/banner.service';
import { SiteContentStore } from '../../core/services/site-content.store';
import { PromotionItem, PromotionService } from '../../core/services/promotion.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DecimalPipe, DatePipe],
  template: `
    <!-- PROMOTIONS HERO BANNER (DISPLAYED FIRST AS A REAL SYSTEM CAROUSEL) -->
    @if (promotions().length > 0) {
      <section
        class="promo-hero"
        (mouseenter)="pausePromo()"
        (mouseleave)="resumePromo()"
      >
        @for (p of promotions(); track p.id; let idx = $index) {
          <div
            class="promo-slide"
            [class.active]="idx === currentPromoIndex()"
            [attr.aria-hidden]="idx !== currentPromoIndex()"
          >
            <!-- Background Image or Decorative Wood Gradient -->
            @if (p.bannerUrl) {
              <img
                class="promo-bg"
                [src]="p.bannerUrl"
                [alt]="p.title"
                loading="eager"
              />
            } @else {
              <div class="promo-bg-fallback"></div>
            }

            <!-- Deep readable overlay -->
            <div class="promo-overlay"></div>

            <div class="wrap promo-container">
              <div class="promo-content">
                <!-- Eyebrow & Badge -->
                <div class="promo-badge-row">
                  <span class="promo-deal-pill">
                    @if (p.discountType === 'PERCENTAGE') {
                      {{ p.discountValue }}% OFF
                    } @else {
                      Rs. {{ p.discountValue | number }} OFF
                    }
                  </span>
                  @if (promotions().length > 1) {
                    <span class="promo-counter">Special Offer {{ idx + 1 }} of {{ promotions().length }}</span>
                  }
                </div>

                <h1 class="promo-title">{{ p.title }}</h1>

                @if (p.description) {
                  <p class="promo-desc">{{ p.description }}</p>
                }

                <!-- Promo Coupon Code Copy Box -->
                @if (p.code) {
                  <div class="coupon-box">
                    <div class="coupon-left">
                      <span class="coupon-label">USE PROMO CODE</span>
                      <span class="coupon-code">{{ p.code }}</span>
                    </div>
                    <button
                      type="button"
                      class="coupon-copy-btn"
                      (click)="copyPromoCode(p.code)"
                      [class.copied]="copiedCode() === p.code"
                      [title]="'Copy code ' + p.code"
                    >
                      @if (copiedCode() === p.code) {
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Copied!</span>
                      } @else {
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <span>Copy Code</span>
                      }
                    </button>
                  </div>
                }

                <!-- Requirements footnote if present -->
                <div class="promo-terms">
                  @if (p.minOrderAmount) {
                    <span>&bull; Min order: Rs. {{ p.minOrderAmount | number }}</span>
                  }
                  @if (p.maxDiscountAmount) {
                    <span>&bull; Max savings: Rs. {{ p.maxDiscountAmount | number }}</span>
                  }
                  <span>&bull; Handcrafted quality guaranteed</span>
                </div>

                <!-- Action CTA -->
                <div class="promo-actions">
                  <a routerLink="/shop" class="btn btn-primary promo-cta">
                    <span>Shop Offers Now</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                  <a routerLink="/about" class="btn btn-outline-light promo-sub-cta">
                    Our Story
                  </a>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Carousel Left / Right Navigation Arrows (Visible when > 1 promotion) -->
        @if (promotions().length > 1) {
          <button
            type="button"
            class="carousel-nav-btn prev"
            (click)="prevPromo()"
            aria-label="Previous promotion"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <button
            type="button"
            class="carousel-nav-btn next"
            (click)="nextPromo()"
            aria-label="Next promotion"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          <!-- Carousel Dots Indicator -->
          <div class="carousel-dots">
            @for (p of promotions(); track p.id; let idx = $index) {
              <button
                type="button"
                class="carousel-dot"
                [class.active]="idx === currentPromoIndex()"
                (click)="goToPromo(idx)"
                [attr.aria-label]="'Go to promotion ' + (idx + 1)"
              ></button>
            }
          </div>
        }
      </section>
    } @else {
      <!-- FALLBACK HERO BANNER (When no active promotions) -->
      <section class="hero">
        <img
          class="bg"
          [src]="activeBanner()?.imageUrl || '/assets/images/hero-cover.jpg'"
          [alt]="activeBanner()?.title || 'Handcrafted wooden cutting boards'"
        />
        <div class="overlay"></div>
        <div class="wrap">
          <div class="content">
            <div class="eyebrow hero-anim d1 light">Handcrafted in Sri Lanka</div>
            <h1 class="hero-anim d2">
              @if (activeBanner()?.title) {
                {{ activeBanner()!.title }}
              } @else {
                Cutting Boards Built<br />For Real Kitchens.
              }
            </h1>
            <p class="hero-anim d3">
              {{ activeBanner()?.subtitle || 'Solid hardwood boards — food-safe, durable and easy to clean — shaped by hand and finished with natural oils.' }}
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
    }

    <!-- Brand Introduction -->
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

    <!-- Best Sellers / Featured Products -->
    <section class="section top-flush">
      <div class="wrap">
        <div class="eyebrow center">{{ content.homeFeaturedSubheading() || 'Best Sellers' }}</div>
        <h2 class="serif center">{{ content.homeFeaturedHeading() || 'Featured Cutting Boards' }}</h2>
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

    <!-- Why Choose Us -->
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

    <!-- REAL CUSTOMER REVIEWS & RATINGS -->
    <section class="section shaded-cream" id="home-reviews">
      <div class="wrap">
        <div class="eyebrow center">Verified Customer Experiences</div>
        <h2 class="serif center">Customer Reviews &amp; Ratings</h2>

        <!-- Real Overall Rating Summary Banner -->
        @if (storeReviews(); as s) {
          <div class="review-stats-card">
            <div class="stats-left">
              <span class="rating-large">{{ s.averageRating | number:'1.1-1' }}</span>
              <div class="rating-stars-group">
                <div class="stars-gold">
                  @for (st of [1,2,3,4,5]; track st) {
                    <span class="star-gold" [class.filled]="st <= s.averageRating">★</span>
                  }
                </div>
                <span class="rating-based">Based on {{ s.totalReviews }} verified customer {{ s.totalReviews === 1 ? 'review' : 'reviews' }}</span>
              </div>
            </div>

            <div class="stats-divider"></div>

            <div class="stats-right">
              <div class="stat-pill">
                <span class="pill-val">{{ s.fiveStarCount }}</span>
                <span class="pill-lbl">5-Star Excellence</span>
              </div>
              <div class="stat-pill">
                <span class="pill-val">100%</span>
                <span class="pill-lbl">Food-Safe Finish</span>
              </div>
              <div class="stat-pill">
                <span class="pill-val">Island-Wide</span>
                <span class="pill-lbl">Doorstep Delivery</span>
              </div>
            </div>

            <div class="stats-divider"></div>

            <div class="stats-action">
              <button type="button" class="btn btn-primary write-btn" (click)="openReviewModal()">
                ★ Write a Review
              </button>
            </div>
          </div>
        }

        <!-- Filter Rating Tabs -->
        @if (reviewsList().length > 0) {
          <div class="review-filters">
            <button
              type="button"
              class="filter-pill"
              [class.active]="selectedCategoryFilter() === 'ALL' && selectedRatingFilter() === 0"
              (click)="setReviewCategoryFilter('ALL'); setRatingFilter(0)"
            >
              All Reviews ({{ reviewsList().length }})
            </button>
            <button
              type="button"
              class="filter-pill"
              [class.active]="selectedCategoryFilter() === 'STORE'"
              (click)="setReviewCategoryFilter('STORE')"
            >
              🏬 Store Experience ({{ countStoreReviews() }})
            </button>
            <button
              type="button"
              class="filter-pill"
              [class.active]="selectedCategoryFilter() === 'PRODUCT'"
              (click)="setReviewCategoryFilter('PRODUCT')"
            >
              🪵 Craft Reviews ({{ countProductReviews() }})
            </button>
            <button
              type="button"
              class="filter-pill"
              [class.active]="selectedRatingFilter() === 5"
              (click)="setRatingFilter(5)"
            >
              ★ 5 Stars ({{ countByRating(5) }})
            </button>
            @if (countByRating(4) > 0) {
              <button
                type="button"
                class="filter-pill"
                [class.active]="selectedRatingFilter() === 4"
                (click)="setRatingFilter(4)"
              >
                ★ 4 Stars ({{ countByRating(4) }})
              </button>
            }
          </div>
        }

        <!-- Dynamic Reviews Grid -->
        <div class="grid tgrid">
          @if (displayedReviews().length > 0) {
            @for (rev of displayedReviews(); track rev.id) {
              <div class="card tcard">
                <!-- Reviewer Header -->
                <div class="tcard-header">
                  <div class="reviewer-meta-left">
                    <div class="reviewer-avatar">{{ getInitials(rev.reviewerName) }}</div>
                    <div class="reviewer-text">
                      <div class="reviewer-name-row">
                        <span class="reviewer-name">{{ rev.reviewerName }}</span>
                        @if (rev.verifiedPurchase) {
                          <span class="badge-verified" title="Verified Customer">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            Verified Buyer
                          </span>
                        }
                      </div>
                      <span class="review-date">{{ rev.createdAt | date:'mediumDate' }}</span>
                    </div>
                  </div>

                  <!-- Stars -->
                  <div class="stars-gold-sm">
                    @for (st of [1,2,3,4,5]; track st) {
                      <span class="star-sm" [class.filled]="st <= rev.rating">★</span>
                    }
                  </div>
                </div>

                <!-- Review Content -->
                <p class="review-body">"{{ rev.comment }}"</p>

                <!-- Product Box or Common Store Experience Badge -->
                @if (!rev.productId || rev.reviewType === 'STORE') {
                  <div class="store-review-badge">
                    <span class="store-badge-icon">🏬</span>
                    <div class="store-badge-text">
                      <span class="store-badge-title">Store &amp; Service Experience</span>
                      <span class="store-badge-sub">Packaging, Delivery Speed &amp; Customer Care</span>
                    </div>
                  </div>
                } @else if (rev.productName) {
                  <a [routerLink]="['/product', rev.productId]" class="reviewed-product-chip" [title]="'View ' + rev.productName">
                    @if (rev.productImage) {
                      <img [src]="rev.productImage" [alt]="rev.productName" class="chip-img" />
                    }
                    <div class="chip-details">
                      <span class="chip-label">Purchased Craft</span>
                      <span class="chip-title">{{ rev.productName }}</span>
                    </div>
                    <span class="chip-arrow">&rarr;</span>
                  </a>
                }
              </div>
            }
          } @else if (isLoadingReviews()) {
            <div class="loading-reviews">Loading real customer reviews...</div>
          }
        </div>
      </div>
    </section>

    <!-- Write a Review Modal -->
    @if (showReviewModal()) {
      <div class="modal-backdrop" (click)="closeReviewModal()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <div class="eyebrow" style="margin-bottom:4px;">Customer Feedback</div>
              <h3 class="serif" style="margin:0;font-size:22px;">Write a Review</h3>
            </div>
            <button type="button" class="modal-close-btn" (click)="closeReviewModal()">✕</button>
          </div>

          <!-- Review Type Selector: Common vs Product -->
          <div class="review-type-selector">
            <button
              type="button"
              class="type-pill"
              [class.active]="reviewType() === 'STORE'"
              (click)="setReviewType('STORE')"
            >
              🏬 Store Experience (Common)
            </button>
            <button
              type="button"
              class="type-pill"
              [class.active]="reviewType() === 'PRODUCT'"
              (click)="setReviewType('PRODUCT')"
            >
              🪵 Specific Handcrafted Craft
            </button>
          </div>

          @if (reviewSubmitSuccess()) {
            <div class="review-success-box">
              ✓ {{ reviewSubmitSuccess() }}
            </div>
          } @else {
            <form class="review-form" (ngSubmit)="submitReview()">
              @if (reviewType() === 'STORE') {
                <div class="store-review-notice">
                  🌟 You are sharing a <strong>general review</strong> about LeeCraft's overall shopping experience, packaging, island-wide delivery, or customer service.
                </div>
              } @else {
                <!-- Product Select -->
                <div class="field">
                  <label>Select Craft You Own *</label>
                  <select [(ngModel)]="reviewForm.productId" name="productId" required>
                    @for (prod of allProducts(); track prod.id) {
                      <option [value]="prod.id">{{ prod.name }} (Rs. {{ prod.price | number }})</option>
                    }
                  </select>
                </div>
              }

              <!-- Rating Select -->
              <div class="field">
                <label>Rating *</label>
                <div class="modal-stars">
                  @for (s of [1,2,3,4,5]; track s) {
                    <button
                      type="button"
                      class="modal-star-btn"
                      [class.active]="s <= reviewForm.rating"
                      (click)="reviewForm.rating = s"
                    >★</button>
                  }
                  <span class="modal-star-val">{{ reviewForm.rating }} of 5 Stars</span>
                </div>
              </div>

              <!-- Name & Email -->
              <div class="modal-form-row">
                <div class="field">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    required
                    [(ngModel)]="reviewForm.reviewerName"
                    name="reviewerName"
                    placeholder="e.g. Kasun Fernando"
                  />
                </div>
                <div class="field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    [(ngModel)]="reviewForm.reviewerEmail"
                    name="reviewerEmail"
                    placeholder="Optional (Checks Verified Buyer)"
                  />
                </div>
              </div>

              <!-- Comment -->
              <div class="field">
                <label>Review &amp; Feedback *</label>
                <textarea
                  rows="4"
                  required
                  [(ngModel)]="reviewForm.comment"
                  name="comment"
                  placeholder="Share details about wood grain, knife durability, finish, or island-wide delivery..."
                ></textarea>
              </div>

              @if (reviewSubmitError()) {
                <div class="review-error-box">{{ reviewSubmitError() }}</div>
              }

              <div class="modal-actions">
                <button type="button" class="btn btn-outline" (click)="closeReviewModal()">Cancel</button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="isSubmittingReview() || !reviewForm.reviewerName.trim() || !reviewForm.comment.trim()"
                >
                  {{ isSubmittingReview() ? 'Posting...' : 'Submit Review' }}
                </button>
              </div>
            </form>
          }
        </div>
      </div>
    }

    <!-- Bottom Promo Banner (Matching Active Promo or Fallback) -->
    <div class="promo">
      <div class="wrap">
        @if (promotions().length > 0 && promotions()[0].code) {
          <h2 class="serif">{{ promotions()[0].title }}</h2>
          <p>
            {{ promotions()[0].description || 'Use the code below at checkout to enjoy this offer' }}
          </p>
          <div class="promo-bottom-code-row">
            <span class="code">{{ promotions()[0].code }}</span>
            <button
              type="button"
              class="btn btn-outline-light"
              (click)="copyPromoCode(promotions()[0].code)"
            >
              {{ copiedCode() === promotions()[0].code ? '✓ Copied!' : 'Copy Code' }}
            </button>
            <button class="btn btn-primary" routerLink="/shop">
              Shop Now
            </button>
          </div>
        } @else {
          <h2 class="serif">Get 10% Off Your First Order</h2>
          <p>Use the code below at checkout</p>
          <div class="promo-bottom-code-row">
            <span class="code">LEECRAFT10</span>
            <button class="btn btn-outline-light" routerLink="/shop">
              Shop Now
            </button>
          </div>
        }
      </div>
    </div>

    <!-- Newsletter -->
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
      /* ==========================================================================
         PROMOTIONS CAROUSEL HERO (FIRST IN DASHBOARD)
         ========================================================================== */
      .promo-hero {
        position: relative;
        height: 580px;
        overflow: hidden;
        background: var(--wood-900, #22150c);
      }
      .promo-slide {
        position: absolute;
        inset: 0;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1),
                    visibility 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        z-index: 1;
      }
      .promo-slide.active {
        opacity: 1;
        visibility: visible;
        z-index: 2;
      }
      .promo-bg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        transform: scale(1.03);
        transition: transform 7s ease;
      }
      .promo-slide.active .promo-bg {
        transform: scale(1);
      }
      .promo-bg-fallback {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at 75% 30%, #53331b 0%, #2a180d 60%, #150b06 100%);
      }
      .promo-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          rgba(20, 11, 6, 0.88) 0%,
          rgba(20, 11, 6, 0.75) 45%,
          rgba(20, 11, 6, 0.35) 85%,
          rgba(20, 11, 6, 0.2) 100%
        );
      }
      .promo-container {
        position: relative;
        z-index: 3;
        width: 100%;
      }
      .promo-content {
        max-width: 620px;
      }
      .promo-badge-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
      }
      .promo-deal-pill {
        background: #C85A32;
        color: #FFF;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.8px;
        text-transform: uppercase;
        padding: 5px 14px;
        border-radius: 20px;
        box-shadow: 0 4px 14px rgba(200, 90, 50, 0.4);
      }
      .promo-counter {
        font-size: 12.5px;
        color: #E6CEB5;
        letter-spacing: 0.5px;
        font-weight: 500;
      }
      .promo-title {
        font-size: 46px;
        line-height: 1.15;
        color: #FFF;
        font-weight: 500;
        font-family: 'Fraunces', 'Georgia', serif;
        margin: 0 0 16px;
        text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      }
      .promo-desc {
        font-size: 16px;
        line-height: 1.65;
        color: #EBD9C7;
        margin: 0 0 24px;
        max-width: 520px;
      }

      /* Coupon Copy Box */
      .coupon-box {
        display: inline-flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.12);
        border: 1.5px dashed rgba(235, 217, 199, 0.6);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border-radius: 8px;
        padding: 6px 6px 6px 16px;
        gap: 16px;
        margin-bottom: 18px;
      }
      .coupon-left {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .coupon-label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.8px;
        color: #E2B28B;
        text-transform: uppercase;
      }
      .coupon-code {
        font-size: 18px;
        font-weight: 800;
        letter-spacing: 2px;
        color: #FFF;
        font-family: monospace;
      }
      .coupon-copy-btn {
        background: #FFF;
        color: var(--wood-900, #22150c);
        border: none;
        border-radius: 6px;
        padding: 8px 14px;
        font-size: 12.5px;
        font-weight: 600;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: all 0.18s ease;
      }
      .coupon-copy-btn:hover {
        background: #F3EADB;
        transform: translateY(-1px);
      }
      .coupon-copy-btn.copied {
        background: #2E7D32;
        color: #FFF;
      }

      .promo-terms {
        font-size: 12px;
        color: #CBB29B;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 26px;
      }
      .promo-actions {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .promo-cta {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 13px 26px;
        font-size: 14.5px;
        font-weight: 600;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
      }
      .promo-sub-cta {
        padding: 13px 22px;
        font-size: 14px;
      }

      /* Carousel Controls */
      .carousel-nav-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
        background: rgba(255, 255, 255, 0.2);
        color: #FFF;
        border: 1px solid rgba(255, 255, 255, 0.35);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        width: 46px;
        height: 46px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .carousel-nav-btn:hover {
        background: rgba(255, 255, 255, 0.4);
        transform: translateY(-50%) scale(1.08);
      }
      .carousel-nav-btn.prev {
        left: 24px;
      }
      .carousel-nav-btn.next {
        right: 24px;
      }

      .carousel-dots {
        position: absolute;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .carousel-dot {
        background: rgba(255, 255, 255, 0.35);
        border: none;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        cursor: pointer;
        padding: 0;
        transition: all 0.25s ease;
      }
      .carousel-dot.active {
        width: 32px;
        background: #FFF;
      }

      /* ==========================================================================
         STANDARD HERO BANNER (FALLBACK)
         ========================================================================== */
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

      /* ==========================================================================
         REAL CUSTOMER REVIEWS & RATINGS STYLING
         ========================================================================== */
      .shaded-cream {
        background: var(--cream-2, #F8F3EC);
        padding: 68px 0;
      }
      .review-stats-card {
        background: #FFF;
        border: 1px solid var(--line, #EADFCF);
        border-radius: 12px;
        padding: 24px 34px;
        max-width: 980px;
        margin: 0 auto 34px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        box-shadow: 0 4px 20px rgba(42, 29, 20, 0.05);
      }
      .stats-left {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .rating-large {
        font-size: 46px;
        font-weight: 700;
        color: var(--wood-900, #22150C);
        line-height: 1;
        font-family: 'Fraunces', Georgia, serif;
      }
      .rating-stars-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .stars-gold {
        color: #D5C2AF;
        font-size: 19px;
        letter-spacing: 2px;
        line-height: 1;
      }
      .star-gold.filled {
        color: #D97706;
      }
      .rating-based {
        font-size: 12.5px;
        color: var(--wood-500, #8A4B2E);
        font-weight: 500;
      }
      .stats-divider {
        width: 1px;
        height: 52px;
        background: var(--line, #EADFCF);
      }
      .stats-right {
        display: flex;
        align-items: center;
        gap: 24px;
      }
      .stat-pill {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      .pill-val {
        font-size: 21px;
        font-weight: 700;
        color: var(--wood-800, #3B2A20);
      }
      .pill-lbl {
        font-size: 11.5px;
        color: var(--wood-500, #8A4B2E);
        margin-top: 2px;
      }
      .stats-action .write-btn {
        padding: 10px 20px;
        font-size: 13.5px;
        font-weight: 600;
        border-radius: 6px;
        white-space: nowrap;
      }

      /* Review Filters */
      .review-filters {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-bottom: 30px;
        flex-wrap: wrap;
      }
      .filter-pill {
        padding: 7px 18px;
        border-radius: 20px;
        border: 1px solid var(--line, #EADFCF);
        background: #FFF;
        font-size: 13px;
        font-weight: 500;
        color: var(--wood-700, #5C4530);
        cursor: pointer;
        transition: all 0.18s ease;
      }
      .filter-pill:hover {
        background: #F3EADB;
        color: var(--wood-900, #22150C);
      }
      .filter-pill.active {
        background: var(--wood-500, #8A4B2E);
        color: #FFF;
        border-color: var(--wood-500, #8A4B2E);
        box-shadow: 0 2px 8px rgba(138, 75, 46, 0.25);
      }

      /* Reviews Grid */
      .tgrid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 22px;
      }
      .tcard {
        background: #FFF;
        border: 1px solid var(--line, #EADFCF);
        border-radius: 12px;
        padding: 22px 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-shadow: 0 2px 10px rgba(42, 29, 20, 0.04);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .tcard:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 24px rgba(42, 29, 20, 0.08);
      }
      .tcard-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 14px;
      }
      .reviewer-meta-left {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .reviewer-avatar {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: var(--wood-600, #693721);
        color: #FFF;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .reviewer-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .reviewer-name-row {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }
      .reviewer-name {
        font-size: 13.5px;
        font-weight: 600;
        color: var(--wood-900, #22150C);
      }
      .review-date {
        font-size: 11px;
        color: var(--wood-400, #A9764F);
      }
      .badge-verified {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        background: #E8F5E9;
        color: #2E7D32;
        font-size: 10.5px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 10px;
      }
      .stars-gold-sm {
        color: #D5C2AF;
        font-size: 15px;
        letter-spacing: 1px;
        flex-shrink: 0;
      }
      .star-sm.filled {
        color: #D97706;
      }
      .review-body {
        font-size: 14px;
        line-height: 1.65;
        font-style: italic;
        font-family: 'Fraunces', serif;
        color: #4A3826;
        margin: 0 0 16px;
        flex: 1;
      }

      /* Reviewed Product Chip */
      .reviewed-product-chip {
        background: #FAF6F0;
        border: 1px solid var(--line, #EADFCF);
        border-radius: 8px;
        padding: 8px 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        transition: background 0.15s ease, border-color 0.15s ease;
      }
      .reviewed-product-chip:hover {
        background: #F3EADB;
        border-color: var(--wood-400, #A9764F);
      }
      .chip-img {
        width: 38px;
        height: 38px;
        border-radius: 5px;
        object-fit: cover;
        flex-shrink: 0;
      }
      .chip-details {
        display: flex;
        flex-direction: column;
        gap: 1px;
        min-width: 0;
        flex: 1;
      }
      .chip-label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--wood-400, #A9764F);
        letter-spacing: 0.5px;
      }
      .chip-title {
        font-size: 12.5px;
        font-weight: 600;
        color: var(--wood-900, #22150C);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .chip-arrow {
        color: var(--wood-500, #8A4B2E);
        font-size: 13px;
      }

      .loading-reviews {
        grid-column: 1 / -1;
        text-align: center;
        padding: 40px;
        color: var(--wood-500, #8A4B2E);
        font-size: 14px;
      }

      /* ==========================================================================
         WRITE A REVIEW MODAL
         ========================================================================== */
      .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(20, 11, 6, 0.65);
        backdrop-filter: blur(4px);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        animation: fadeIn 0.2s ease-out;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .modal-card {
        background: #FFF;
        border-radius: 12px;
        max-width: 540px;
        width: 100%;
        padding: 28px 30px;
        box-shadow: 0 20px 45px rgba(0, 0, 0, 0.25);
        animation: popUp 0.25s cubic-bezier(0.2, 0.7, 0.2, 1);
      }
      @keyframes popUp {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      .modal-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 20px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--line, #EADFCF);
      }
      .modal-close-btn {
        background: none;
        border: none;
        font-size: 18px;
        color: var(--wood-500, #8A4B2E);
        cursor: pointer;
      }
      .modal-stars {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 4px;
      }
      .modal-star-btn {
        background: none;
        border: none;
        font-size: 26px;
        color: #D5C2AF;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        transition: transform 0.15s ease, color 0.15s ease;
      }
      .modal-star-btn:hover {
        transform: scale(1.15);
      }
      .modal-star-btn.active {
        color: #D97706;
      }
      .modal-star-val {
        font-size: 13px;
        color: var(--wood-700, #5C4530);
        margin-left: 8px;
        font-weight: 500;
      }
      .modal-form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
      }
      .review-form .field {
        margin-bottom: 14px;
      }
      .review-form label {
        display: block;
        font-size: 12px;
        font-weight: 600;
        color: var(--wood-800, #3B2A20);
        margin-bottom: 5px;
      }
      .review-form input,
      .review-form select,
      .review-form textarea {
        width: 100%;
        border: 1px solid var(--line, #EADFCF);
        background: var(--cream, #FBF6EF);
        border-radius: 6px;
        padding: 10px 12px;
        font-size: 13.5px;
        outline: none;
        color: var(--wood-900, #22150C);
        box-sizing: border-box;
      }
      .review-form input:focus,
      .review-form select:focus,
      .review-form textarea:focus {
        border-color: var(--wood-500, #8A4B2E);
        background: #FFF;
      }
      .review-error-box {
        background: #FBEAE8;
        color: #C53030;
        padding: 10px 14px;
        border-radius: 6px;
        font-size: 13px;
        margin-bottom: 14px;
      }
      .review-success-box {
        background: #E8F5E9;
        color: #2E7D32;
        padding: 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        text-align: center;
      }
      .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 18px;
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
      .promo-bottom-code-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        flex-wrap: wrap;
      }
      .promo .code {
        background: rgba(255, 255, 255, 0.12);
        border: 1px dashed var(--wood-200);
        padding: 8px 18px;
        border-radius: 3px;
        font-size: 14px;
        letter-spacing: 2px;
        font-family: monospace;
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
        .promo-hero {
          height: auto;
          min-height: 480px;
          padding: 60px 0;
        }
        .promo-title {
          font-size: 32px;
        }
        .promo-desc {
          font-size: 14.5px;
        }
        .coupon-box {
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
        }
        .carousel-nav-btn {
          display: none;
        }
        .hero h1 {
          font-size: 34px;
        }
        .pgrid,
        .why-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .review-stats-card {
          flex-direction: column;
          gap: 18px;
          padding: 20px;
          text-align: center;
        }
        .stats-left {
          flex-direction: column;
        }
        .stats-divider {
          display: none;
        }
        .stats-right {
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
        }
        .tgrid {
          grid-template-columns: 1fr;
        }
        .modal-form-row {
          grid-template-columns: 1fr;
        }
      }

      .store-review-badge {
        display: flex;
        align-items: center;
        gap: 10px;
        background: #fdfaf6;
        border: 1px solid var(--line);
        border-radius: 6px;
        padding: 8px 12px;
        margin-top: 14px;
      }
      .store-badge-icon {
        font-size: 20px;
      }
      .store-badge-title {
        font-weight: 600;
        font-size: 12.5px;
        color: var(--wood-900);
        display: block;
      }
      .store-badge-sub {
        font-size: 11px;
        color: var(--wood-500);
        display: block;
      }
      .review-type-selector {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
      }
      .type-pill {
        flex: 1;
        padding: 8px 12px;
        font-size: 12px;
        font-weight: 600;
        border-radius: 6px;
        border: 1.5px solid var(--line);
        background: #fff;
        cursor: pointer;
        transition: all 0.2s;
        color: var(--wood-700);
      }
      .type-pill.active {
        border-color: var(--wood-800);
        background: var(--wood-800);
        color: #fff;
      }
      .store-review-notice {
        background: #fefce8;
        border: 1px solid #fef08a;
        color: #854d0e;
        font-size: 12.5px;
        padding: 10px 14px;
        border-radius: 6px;
        margin-bottom: 14px;
        line-height: 1.4;
      }
    `,
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly notify = inject(NotificationService);
  private readonly productService = inject(ProductService);
  private readonly bannerService = inject(BannerService);
  private readonly promoService = inject(PromotionService);
  public readonly auth = inject(AuthService);
  protected readonly content = inject(SiteContentStore);

  protected readonly featured = signal<Product[]>([]);
  protected readonly allProducts = signal<Product[]>([]);
  protected readonly activeBanner = signal<Banner | null>(null);
  protected readonly promotions = signal<PromotionItem[]>([]);
  protected readonly currentPromoIndex = signal<number>(0);
  protected readonly copiedCode = signal<string | null>(null);
  protected readonly isPaused = signal<boolean>(false);

  // Real Customer Reviews & Store Rating
  protected readonly storeReviews = signal<StoreReviewSummary | null>(null);
  protected readonly reviewsList = signal<Review[]>([]);
  protected readonly isLoadingReviews = signal<boolean>(true);
  protected readonly selectedRatingFilter = signal<number>(0);
  protected readonly selectedCategoryFilter = signal<'ALL' | 'PRODUCT' | 'STORE'>('ALL');
  protected readonly reviewType = signal<'STORE' | 'PRODUCT'>('STORE');

  protected readonly displayedReviews = computed(() => {
    const starFilter = this.selectedRatingFilter();
    const typeFilter = this.selectedCategoryFilter();
    let list = this.reviewsList();

    if (typeFilter === 'PRODUCT') {
      list = list.filter((r) => r.productId && r.productId > 0);
    } else if (typeFilter === 'STORE') {
      list = list.filter((r) => !r.productId || r.reviewType === 'STORE');
    }

    if (starFilter > 0) {
      list = list.filter((r) => r.rating === starFilter);
    }

    return list;
  });

  // Write Review Modal
  protected readonly showReviewModal = signal<boolean>(false);
  protected readonly reviewForm = {
    productId: null as number | null,
    reviewerName: '',
    reviewerEmail: '',
    rating: 5,
    comment: '',
  };
  protected readonly isSubmittingReview = signal<boolean>(false);
  protected readonly reviewSubmitSuccess = signal<string | null>(null);
  protected readonly reviewSubmitError = signal<string | null>(null);

  private autoRotateTimer: any = null;

  ngOnInit(): void {
    this.content.load();

    this.productService.list().subscribe({
      next: (products) => {
        this.featured.set(products.slice(0, 4));
        this.allProducts.set(products);
        if (!this.reviewForm.productId && products.length > 0) {
          this.reviewForm.productId = products[0].id;
        }
      },
      error: (error) => {
        console.error('Failed to load featured products:', error);
      },
    });

    this.bannerService.getActiveBanners().subscribe({
      next: (banners) => this.activeBanner.set(banners[0] ?? null),
      error: (error) => {
        console.error('Failed to load banners:', error);
      },
    });

    // Load active promotions for top priority hero display
    this.promoService.getActivePromotions().subscribe({
      next: (promos) => {
        this.promotions.set(promos || []);
        if (promos && promos.length > 1) {
          this.startAutoRotation();
        }
      },
      error: (error) => {
        console.error('Failed to load promotions:', error);
      },
    });

    // Load REAL customer reviews & store rating summary from database
    this.loadReviews();
  }

  loadReviews(): void {
    this.productService.getFeaturedReviews(12).subscribe({
      next: (summary) => {
        this.storeReviews.set(summary);
        this.reviewsList.set(summary.reviews || []);
        this.isLoadingReviews.set(false);
      },
      error: (error) => {
        console.error('Failed to load real customer reviews:', error);
        this.isLoadingReviews.set(false);
      },
    });
  }

  ngOnDestroy(): void {
    this.stopAutoRotation();
  }

  startAutoRotation(): void {
    this.stopAutoRotation();
    this.autoRotateTimer = setInterval(() => {
      if (!this.isPaused() && this.promotions().length > 1) {
        this.nextPromo();
      }
    }, 5500);
  }

  stopAutoRotation(): void {
    if (this.autoRotateTimer) {
      clearInterval(this.autoRotateTimer);
      this.autoRotateTimer = null;
    }
  }

  nextPromo(): void {
    const total = this.promotions().length;
    if (total <= 1) return;
    this.currentPromoIndex.update((curr) => (curr + 1) % total);
  }

  prevPromo(): void {
    const total = this.promotions().length;
    if (total <= 1) return;
    this.currentPromoIndex.update((curr) => (curr - 1 + total) % total);
  }

  goToPromo(index: number): void {
    this.currentPromoIndex.set(index);
  }

  pausePromo(): void {
    this.isPaused.set(true);
  }

  resumePromo(): void {
    this.isPaused.set(false);
  }

  copyPromoCode(code?: string): void {
    if (!code) return;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code).then(() => {
        this.copiedCode.set(code);
        this.notify.success(`Promo code "${code}" copied to clipboard!`);
        setTimeout(() => {
          if (this.copiedCode() === code) {
            this.copiedCode.set(null);
          }
        }, 3000);
      }).catch(() => {
        this.notify.info(`Promo code: ${code}`);
      });
    } else {
      this.copiedCode.set(code);
      this.notify.info(`Promo code: ${code}`);
    }
  }

  // Filter & Review Helpers
  setRatingFilter(stars: number): void {
    this.selectedRatingFilter.set(stars);
  }

  setReviewCategoryFilter(cat: 'ALL' | 'PRODUCT' | 'STORE'): void {
    this.selectedCategoryFilter.set(cat);
  }

  setReviewType(type: 'STORE' | 'PRODUCT'): void {
    this.reviewType.set(type);
  }

  countStoreReviews(): number {
    return this.reviewsList().filter((r) => !r.productId || r.reviewType === 'STORE').length;
  }

  countProductReviews(): number {
    return this.reviewsList().filter((r) => r.productId && r.productId > 0).length;
  }

  countByRating(stars: number): number {
    return this.reviewsList().filter((r) => r.rating === stars).length;
  }

  getInitials(name: string): string {
    if (!name) return 'LC';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  // Write Review Modal Handlers
  openReviewModal(productId?: number): void {
    if (productId) {
      this.reviewType.set('PRODUCT');
      this.reviewForm.productId = productId;
    } else {
      this.reviewType.set('STORE');
      if (this.allProducts().length > 0 && !this.reviewForm.productId) {
        this.reviewForm.productId = this.allProducts()[0].id;
      }
    }

    const currentUser = this.auth.user();
    this.reviewForm.reviewerName = currentUser?.fullName || '';
    this.reviewForm.reviewerEmail = currentUser?.email || '';
    this.reviewForm.rating = 5;
    this.reviewForm.comment = '';
    this.reviewSubmitError.set(null);
    this.reviewSubmitSuccess.set(null);
    this.showReviewModal.set(true);
  }

  closeReviewModal(): void {
    this.showReviewModal.set(false);
  }

  submitReview(): void {
    const { productId, reviewerName, reviewerEmail, rating, comment } = this.reviewForm;
    const isStore = this.reviewType() === 'STORE';

    if (!isStore && !productId) {
      this.reviewSubmitError.set('Please select which handcrafted product you purchased.');
      return;
    }
    if (!reviewerName.trim()) {
      this.reviewSubmitError.set('Please enter your name.');
      return;
    }
    if (!comment.trim()) {
      this.reviewSubmitError.set('Please share your feedback comment.');
      return;
    }

    this.isSubmittingReview.set(true);
    this.reviewSubmitError.set(null);

    this.productService.submitReview({
      productId: isStore ? null : productId,
      reviewerName: reviewerName.trim(),
      reviewerEmail: reviewerEmail.trim() || undefined,
      rating,
      comment: comment.trim(),
    }).subscribe({
      next: () => {
        this.isSubmittingReview.set(false);
        this.reviewSubmitSuccess.set(
          isStore
            ? 'Thank you for reviewing your LeeCraft shopping experience!'
            : 'Thank you! Your verified craft review has been posted.'
        );
        this.notify.success('Thank you! Your review has been submitted.');
        
        // Reload real reviews immediately from backend
        this.loadReviews();

        setTimeout(() => {
          this.closeReviewModal();
        }, 1500);
      },
      error: (err) => {
        this.isSubmittingReview.set(false);
        this.reviewSubmitError.set(err?.error?.message || 'Failed to submit review. Please try again.');
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

