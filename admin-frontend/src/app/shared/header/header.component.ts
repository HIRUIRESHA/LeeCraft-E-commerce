import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';
import { AdminUiService } from '../../services/admin-ui.service';

/** URL of the customer-facing storefront app (separate Angular project/port). */
const STOREFRONT_URL = 'http://localhost:4200';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    @if (adminAuth.isAuthenticated()) {
      <!-- Mobile Backdrop Overlay -->
      <div
        class="sidebar-backdrop"
        [class.show]="ui.isMobileMenuOpen()"
        (click)="ui.closeMobileMenu()"
      ></div>

      <!-- Modern Sidebar (Desktop Fixed + Mobile Offcanvas) -->
      <aside
        class="admin-sidebar"
        [class.mobile-open]="ui.isMobileMenuOpen()"
        [class.collapsed]="ui.isSidebarCollapsed()"
      >
        <!-- Sidebar Header Brand -->
        <div class="sidebar-header">
          <a
            class="sidebar-brand"
            [href]="storefrontUrl"
            target="_blank"
            rel="noopener"
          >
            <div class="logo-box">
              <img
                src="/assets/images/logo.png"
                alt="LeeCraft"
                class="brand-logo"
              />
            </div>
            @if (!ui.isSidebarCollapsed()) {
              <div class="brand-text">
                <span class="brand-name serif"
                  >LeeCraft<span class="accent">.lk</span></span
                >
                <span class="brand-tag">
                  <span class="live-dot"></span> Admin Panel
                </span>
              </div>
            }
          </a>

          <!-- Mobile Close Button -->
          <button
            type="button"
            class="mobile-close-btn"
            (click)="ui.closeMobileMenu()"
            aria-label="Close menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Navigation Links Container -->
        <nav class="sidebar-nav">
          <!-- SECTION: OVERVIEW -->
          <div class="nav-section-title">
            @if (!ui.isSidebarCollapsed()) {
              <span>Overview</span>
            } @else {
              <div class="section-divider"></div>
            }
          </div>
          <a
            routerLink="/"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            (click)="ui.closeMobileMenu()"
            class="nav-link"
            title="Dashboard"
          >
            <div class="nav-icon">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <rect x="3" y="3" width="7" height="9" rx="1.5" />
                <rect x="14" y="3" width="7" height="5" rx="1.5" />
                <rect x="14" y="12" width="7" height="9" rx="1.5" />
                <rect x="3" y="16" width="7" height="5" rx="1.5" />
              </svg>
            </div>
            @if (!ui.isSidebarCollapsed()) {
              <span class="nav-label">Dashboard</span>
            }
          </a>

          <!-- SECTION: CATALOG -->
          <div class="nav-section-title">
            @if (!ui.isSidebarCollapsed()) {
              <span>Catalog & Stock</span>
            } @else {
              <div class="section-divider"></div>
            }
          </div>
          <a
            routerLink="/products"
            routerLinkActive="active"
            (click)="ui.closeMobileMenu()"
            class="nav-link"
            title="Products"
          >
            <div class="nav-icon">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path d="M21 8 12 3 3 8l9 5 9-5Z" />
                <path d="M3 8v8l9 5 9-5V8" />
                <path d="M12 13v8" />
              </svg>
            </div>
            @if (!ui.isSidebarCollapsed()) {
              <span class="nav-label">Products</span>
            }
          </a>

          <a
            routerLink="/categories"
            routerLinkActive="active"
            (click)="ui.closeMobileMenu()"
            class="nav-link"
            title="Categories"
          >
            <div class="nav-icon">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path
                  d="M20.6 12.4 12.6 20.4a2 2 0 0 1-2.8 0l-6.2-6.2a2 2 0 0 1 0-2.8L11.6 3.4a2 2 0 0 1 1.4-.6H19a2 2 0 0 1 2 2v6.2a2 2 0 0 1-.4 1.4Z"
                />
                <circle cx="15.5" cy="7.5" r="1.2" />
              </svg>
            </div>
            @if (!ui.isSidebarCollapsed()) {
              <span class="nav-label">Categories</span>
            }
          </a>

          <a
            routerLink="/inventory"
            routerLinkActive="active"
            (click)="ui.closeMobileMenu()"
            class="nav-link"
            title="Inventory"
          >
            <div class="nav-icon">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M3 9h18" />
                <path d="M8 14h.01" />
                <path d="M12 14h4" />
              </svg>
            </div>
            @if (!ui.isSidebarCollapsed()) {
              <span class="nav-label">Inventory</span>
            }
          </a>

          <!-- SECTION: MARKETING -->
          <div class="nav-section-title">
            @if (!ui.isSidebarCollapsed()) {
              <span>Marketing & Sales</span>
            } @else {
              <div class="section-divider"></div>
            }
          </div>
          <a
            routerLink="/promotions"
            routerLinkActive="active"
            (click)="ui.closeMobileMenu()"
            class="nav-link"
            title="Promotions & Discounts"
          >
            <div class="nav-icon">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <line x1="19" y1="5" x2="5" y2="19" />
                <circle cx="6.5" cy="6.5" r="2.5" />
                <circle cx="17.5" cy="17.5" r="2.5" />
              </svg>
            </div>
            @if (!ui.isSidebarCollapsed()) {
              <span class="nav-label">Promotions</span>
              <span class="nav-badge">Coupons</span>
            }
          </a>

          <a
            routerLink="/orders"
            routerLinkActive="active"
            (click)="ui.closeMobileMenu()"
            class="nav-link"
            title="Customer Orders"
          >
            <div class="nav-icon">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path
                  d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"
                />
                <path d="M8 6h8" />
                <path d="M8 10h8" />
                <path d="M8 14h5" />
              </svg>
            </div>

            @if (!ui.isSidebarCollapsed()) {
              <span class="nav-label">Orders</span>
            }
          </a>

          <a
            routerLink="/banners"
            routerLinkActive="active"
            (click)="ui.closeMobileMenu()"
            class="nav-link"
            title="Storefront Banners"
          >
            <div class="nav-icon">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <circle cx="8.5" cy="10" r="1.6" />
                <path d="m21 15-5-5-9 9" />
              </svg>
            </div>
            @if (!ui.isSidebarCollapsed()) {
              <span class="nav-label">Banners</span>
            }
          </a>

          <!-- SECTION: CUSTOMERS -->
          <div class="nav-section-title">
            @if (!ui.isSidebarCollapsed()) {
              <span>Customer Care</span>
            } @else {
              <div class="section-divider"></div>
            }
          </div>
          <a
            routerLink="/customers"
            routerLinkActive="active"
            (click)="ui.closeMobileMenu()"
            class="nav-link"
            title="Registered Customers"
          >
            <div class="nav-icon">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                <circle cx="10" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            @if (!ui.isSidebarCollapsed()) {
              <span class="nav-label">Customers</span>
            }
          </a>

          <a
            routerLink="/inquiries"
            routerLinkActive="active"
            (click)="ui.closeMobileMenu()"
            class="nav-link"
            title="Customer Inquiries"
          >
            <div class="nav-icon">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path
                  d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"
                />
              </svg>
            </div>
            @if (!ui.isSidebarCollapsed()) {
              <span class="nav-label">Inquiries</span>
            }
          </a>

          <!-- SECTION: CONTENT -->
          <div class="nav-section-title">
            @if (!ui.isSidebarCollapsed()) {
              <span>Store Content</span>
            } @else {
              <div class="section-divider"></div>
            }
          </div>
          <a
            routerLink="/content"
            routerLinkActive="active"
            (click)="ui.closeMobileMenu()"
            class="nav-link"
            title="Site Content & Copy"
          >
            <div class="nav-icon">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                <path
                  d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z"
                />
                <path d="M9 13h6" />
                <path d="M9 17h6" />
              </svg>
            </div>
            @if (!ui.isSidebarCollapsed()) {
              <span class="nav-label">Site Content</span>
            }
          </a>
        </nav>

        <!-- Sidebar Footer Actions -->
        <div class="sidebar-footer">
          <!-- View Live Storefront Quick Link -->
          @if (!ui.isSidebarCollapsed()) {
            <a
              [href]="storefrontUrl"
              target="_blank"
              rel="noopener"
              class="storefront-card"
              title="Open customer storefront in new tab"
            >
              <div class="sf-icon">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path
                    d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                  ></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </div>
              <div class="sf-details">
                <span class="sf-name">Live Storefront</span>
                <span class="sf-link">Preview store ↗</span>
              </div>
            </a>
          }

          <!-- Admin Profile & Sign Out -->
          <div
            class="admin-user-card"
            [class.compact]="ui.isSidebarCollapsed()"
          >
            <div
              class="user-avatar"
              [title]="adminAuth.admin()?.fullName || 'Admin'"
            >
              {{ adminInitials() }}
            </div>
            @if (!ui.isSidebarCollapsed()) {
              <div class="user-info">
                <span class="user-name">{{
                  adminAuth.admin()?.fullName || 'Administrator'
                }}</span>
                <span class="user-role">Administrator</span>
              </div>
            }
            <button
              type="button"
              class="logout-icon-btn"
              (click)="adminAuth.logout()"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <!-- Sticky Top Header Navbar -->
      <header
        class="top-navbar"
        [class.sidebar-collapsed]="ui.isSidebarCollapsed()"
      >
        <div class="top-navbar-left">
          <!-- Sidebar Toggle (Mobile Hamburger / Desktop Collapse) -->
          <button
            type="button"
            class="toggle-sidebar-btn"
            (click)="onToggleSidebar()"
            title="Toggle Sidebar"
            aria-label="Toggle Sidebar"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.9"
            >
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <!-- Breadcrumb Title -->
          <div class="header-breadcrumb">
            <span class="bc-root">LeeCraft Admin</span>
            <span class="bc-sep">/</span>
            <span class="bc-current">Management Portal</span>
          </div>
        </div>

        <div class="top-navbar-right">
          <!-- View Storefront Quick Button -->
          <a
            [href]="storefrontUrl"
            target="_blank"
            rel="noopener"
            class="store-preview-btn"
            title="Preview customer shop in new tab"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path
                d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
              ></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            <span>Storefront ↗</span>
          </a>

          <!-- Live Online Badge -->
          <div class="status-indicator-pill">
            <span class="pulse-dot"></span>
            <span>Live</span>
          </div>

          <!-- Sign Out Button -->
          <button
            type="button"
            class="header-signout-btn"
            (click)="adminAuth.logout()"
            title="Sign Out of Admin Console"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </header>
    } @else {
      <!-- Clean Minimal Header for Logged-Out / Login Screen -->
      <header class="public-admin-header">
        <div class="wrap public-header-row">
          <a class="public-brand" [href]="storefrontUrl">
            <img class="logo" src="/assets/images/logo.png" alt="LeeCraft.lk" />
            <span class="name serif"
              >LeeCraft<span class="accent">.lk</span></span
            >
          </a>
          <span class="admin-pill">Admin Console</span>
        </div>
      </header>
    }
  `,
  styles: [
    `
      /* ==========================================================================
       SIDEBAR & NAVBAR STYLES — LEECRAFT ADMIN
       ========================================================================== */

      /* Backdrop for mobile drawer */
      .sidebar-backdrop {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(18, 12, 8, 0.65);
        backdrop-filter: blur(4px);
        z-index: 1040;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .sidebar-backdrop.show {
        display: block;
        opacity: 1;
      }

      /* -----------------------------
       ADMIN SIDEBAR (DESKTOP & DRAWER)
       ----------------------------- */
      .admin-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 260px;
        background: linear-gradient(
          180deg,
          #1c1510 0%,
          #221a14 60%,
          #17110c 100%
        );
        color: #e6d8c8;
        z-index: 1050;
        display: flex;
        flex-direction: column;
        border-right: 1px solid rgba(234, 223, 207, 0.12);
        box-shadow: 4px 0 24px rgba(0, 0, 0, 0.25);
        transition:
          width 0.3s cubic-bezier(0.2, 0, 0, 1),
          transform 0.3s cubic-bezier(0.2, 0, 0, 1);
      }

      /* Collapsed mode on desktop */
      .admin-sidebar.collapsed {
        width: 80px;
      }

      /* Sidebar Header */
      .sidebar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 18px 16px;
        border-bottom: 1px solid rgba(234, 223, 207, 0.08);
        min-height: 64px;
      }
      .sidebar-brand {
        display: flex;
        align-items: center;
        gap: 12px;
        text-decoration: none;
        color: inherit;
        overflow: hidden;
      }
      .logo-box {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.06);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px;
        border: 1px solid rgba(234, 223, 207, 0.15);
        flex-shrink: 0;
      }
      .brand-logo {
        max-height: 100%;
        width: auto;
        object-fit: contain;
      }
      .brand-text {
        display: flex;
        flex-direction: column;
        white-space: nowrap;
      }
      .brand-name {
        font-size: 19px;
        font-weight: 600;
        color: #fff7ec;
        letter-spacing: 0.3px;
      }
      .brand-name .accent {
        color: var(--wood-400, #c28148);
      }
      .brand-tag {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 1.2px;
        color: #9e8775;
        display: flex;
        align-items: center;
        gap: 5px;
        margin-top: 1px;
      }
      .live-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #22c55e;
        display: inline-block;
        box-shadow: 0 0 6px #22c55e;
      }

      .mobile-close-btn {
        display: none;
        background: none;
        border: none;
        color: #d8c6b2;
        cursor: pointer;
        padding: 6px;
        border-radius: 6px;
      }
      .mobile-close-btn:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #fff;
      }

      /* Navigation Links Container */
      .sidebar-nav {
        flex: 1;
        padding: 14px 12px;
        overflow-y: auto;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .sidebar-nav::-webkit-scrollbar {
        width: 4px;
      }
      .sidebar-nav::-webkit-scrollbar-thumb {
        background: rgba(234, 223, 207, 0.15);
        border-radius: 4px;
      }

      /* Section Titles */
      .nav-section-title {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1.4px;
        color: #8c7563;
        padding: 14px 10px 4px;
        margin-top: 4px;
        white-space: nowrap;
      }
      .section-divider {
        height: 1px;
        background: rgba(234, 223, 207, 0.08);
        margin: 8px 4px;
      }

      /* Nav Item Link */
      .nav-link {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        border-radius: 9px;
        color: #cdbeb0;
        text-decoration: none;
        font-size: 13.5px;
        font-weight: 500;
        letter-spacing: 0.2px;
        transition: all 0.18s ease;
        white-space: nowrap;
        position: relative;
      }
      .admin-sidebar.collapsed .nav-link {
        justify-content: center;
        padding: 11px 0;
      }

      .nav-icon {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: #aa9583;
        transition:
          transform 0.2s ease,
          color 0.2s ease;
      }
      .nav-link:hover .nav-icon {
        color: #fff;
        transform: scale(1.1);
      }

      .nav-label {
        flex: 1;
      }

      .nav-badge {
        font-size: 9.5px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        padding: 2px 6px;
        border-radius: 4px;
        background: rgba(194, 129, 72, 0.22);
        color: #e89e62;
        border: 1px solid rgba(194, 129, 72, 0.35);
      }

      /* Hover & Active States */
      .nav-link:hover {
        background: rgba(255, 255, 255, 0.06);
        color: #fff;
        transform: translateX(2px);
      }
      .admin-sidebar.collapsed .nav-link:hover {
        transform: none;
      }

      .nav-link.active {
        background: linear-gradient(
          90deg,
          rgba(194, 129, 72, 0.24) 0%,
          rgba(138, 75, 46, 0.14) 100%
        );
        color: #fff;
        font-weight: 600;
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.08),
          0 4px 12px rgba(0, 0, 0, 0.2);
      }
      .nav-link.active .nav-icon {
        color: #e89e62;
      }
      .nav-link.active::before {
        content: '';
        position: absolute;
        left: 0;
        top: 6px;
        bottom: 6px;
        width: 3.5px;
        border-radius: 0 4px 4px 0;
        background: #c28148;
        box-shadow: 0 0 8px #c28148;
      }

      /* Sidebar Footer */
      .sidebar-footer {
        padding: 14px 12px;
        border-top: 1px solid rgba(234, 223, 207, 0.08);
        display: flex;
        flex-direction: column;
        gap: 10px;
        background: rgba(0, 0, 0, 0.15);
      }

      /* Storefront Card */
      .storefront-card {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 9px 12px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(234, 223, 207, 0.1);
        text-decoration: none;
        color: inherit;
        transition: all 0.2s ease;
      }
      .storefront-card:hover {
        background: rgba(194, 129, 72, 0.14);
        border-color: rgba(194, 129, 72, 0.4);
        transform: translateY(-1px);
      }
      .sf-icon {
        color: #c28148;
        display: flex;
        align-items: center;
      }
      .sf-details {
        display: flex;
        flex-direction: column;
      }
      .sf-name {
        font-size: 12px;
        font-weight: 600;
        color: #fff;
      }
      .sf-link {
        font-size: 10.5px;
        color: #aa9583;
      }

      /* Admin User Card */
      .admin-user-card {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 10px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.03);
      }
      .admin-user-card.compact {
        justify-content: center;
        padding: 6px 0;
      }
      .user-avatar {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: linear-gradient(
          135deg,
          var(--wood-500, #8a4b2e),
          var(--wood-400, #a9764f)
        );
        color: #fff;
        font-size: 12.5px;
        font-weight: 700;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1.5px solid rgba(234, 223, 207, 0.3);
        flex-shrink: 0;
      }
      .user-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        white-space: nowrap;
      }
      .user-name {
        font-size: 12.5px;
        font-weight: 600;
        color: #fff;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .user-role {
        font-size: 10.5px;
        color: #9e8775;
        letter-spacing: 0.3px;
      }
      .logout-icon-btn {
        background: none;
        border: none;
        color: #aa9583;
        cursor: pointer;
        padding: 6px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }
      .logout-icon-btn:hover {
        background: rgba(220, 38, 38, 0.18);
        color: #ef4444;
      }

      /* -----------------------------
       TOP STICKY NAVBAR
       ----------------------------- */
      .top-navbar {
        position: sticky;
        top: 0;
        z-index: 1030;
        background: rgba(251, 246, 239, 0.96);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid var(--line, #eadfcf);
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px;
        margin-left: 260px;
        transition: margin-left 0.3s cubic-bezier(0.2, 0, 0, 1);
      }
      .top-navbar.sidebar-collapsed {
        margin-left: 80px;
      }

      .top-navbar-left {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .toggle-sidebar-btn {
        background: #fff;
        border: 1px solid var(--line, #eadfcf);
        border-radius: 8px;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--wood-800, #3b2a20);
        cursor: pointer;
        transition: all 0.15s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      }
      .toggle-sidebar-btn:hover {
        background: var(--wood-800, #3b2a20);
        color: #fff;
        border-color: var(--wood-800, #3b2a20);
      }

      .header-breadcrumb {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
      }
      .bc-root {
        font-weight: 700;
        color: var(--wood-800, #3b2a20);
        letter-spacing: 0.3px;
      }
      .bc-sep {
        color: var(--wood-400, #a9764f);
        font-weight: 300;
      }
      .bc-current {
        color: var(--wood-500, #8a4b2e);
        font-weight: 500;
      }

      .top-navbar-right {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .store-preview-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #fff;
        border: 1px solid var(--line, #eadfcf);
        border-radius: 20px;
        padding: 6px 14px;
        font-size: 12px;
        font-weight: 600;
        color: var(--wood-700, #5c4530);
        text-decoration: none;
        transition: all 0.15s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      }
      .store-preview-btn:hover {
        background: var(--wood-500, #8a4b2e);
        color: #fff;
        border-color: var(--wood-500, #8a4b2e);
        transform: translateY(-1px);
      }

      .status-indicator-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        border-radius: 20px;
        padding: 5px 11px;
        font-size: 11px;
        font-weight: 600;
        color: #166534;
      }
      .pulse-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #16a34a;
        display: inline-block;
        box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.2);
        animation: pulse 2s infinite;
      }
      @keyframes pulse {
        0% {
          transform: scale(0.95);
          box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.6);
        }
        70% {
          transform: scale(1);
          box-shadow: 0 0 0 6px rgba(22, 163, 74, 0);
        }
        100% {
          transform: scale(0.95);
          box-shadow: 0 0 0 0 rgba(22, 163, 74, 0);
        }
      }

      .header-signout-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: none;
        border: 1px solid var(--line, #eadfcf);
        border-radius: 20px;
        padding: 6px 14px;
        font-size: 12px;
        font-weight: 500;
        color: var(--wood-700, #5c4530);
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .header-signout-btn:hover {
        background: #fee2e2;
        border-color: #fca5a5;
        color: #dc2626;
      }

      /* -----------------------------
       PUBLIC / LOGGED-OUT HEADER
       ----------------------------- */
      .public-admin-header {
        background: var(--cream, #fbf6ef);
        border-bottom: 1px solid var(--line, #eadfcf);
      }
      .public-header-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 0;
      }
      .public-brand {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
      }
      .public-brand .logo {
        height: 40px;
        width: auto;
      }
      .public-brand .name {
        font-size: 20px;
        color: var(--wood-800, #3b2a20);
      }
      .public-brand .accent {
        color: var(--wood-400, #a9764f);
      }
      .admin-pill {
        font-size: 11px;
        letter-spacing: 1px;
        text-transform: uppercase;
        background: var(--wood-800, #3b2a20);
        color: #fff;
        padding: 6px 14px;
        border-radius: 20px;
        font-weight: 600;
      }

      /* -----------------------------
       RESPONSIVE BREAKPOINTS
       ----------------------------- */
      @media (max-width: 1023px) {
        .admin-sidebar {
          transform: translateX(-100%);
          width: 270px;
        }
        .admin-sidebar.mobile-open {
          transform: translateX(0);
        }
        .mobile-close-btn {
          display: flex;
        }
        .top-navbar {
          margin-left: 0 !important;
          padding: 0 16px;
        }
        .header-breadcrumb .bc-current {
          display: none;
        }
        .store-preview-btn span {
          display: none;
        }
      }
    `,
  ],
})
export class HeaderComponent {
  readonly storefrontUrl = STOREFRONT_URL;
  readonly adminAuth = inject(AdminAuthService);
  readonly ui = inject(AdminUiService);

  readonly adminInitials = computed(() => {
    const name = this.adminAuth.admin()?.fullName || 'Admin';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  });

  onToggleSidebar(): void {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      this.ui.toggleMobileMenu();
    } else {
      this.ui.toggleSidebarCollapsed();
    }
  }
}
