import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminAuthService } from '../../services/admin-auth.service';

/** URL of the customer-facing storefront app. */
const STOREFRONT_URL = 'http://localhost:4200';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (adminAuth.isAuthenticated()) {
      <footer class="admin-footer">
        <div class="admin-footer-wrap">
          <div class="footer-left">
            <span>&copy; {{ year }} <strong class="brand-sub">LeeCraft.lk</strong> &mdash; Administration & Store Management Console</span>
          </div>
          <div class="footer-right">
            <span class="system-tag"><span class="dot"></span> All Systems Operational</span>
            <span class="sep">&bull;</span>
            <a [href]="storefrontUrl" target="_blank" rel="noopener" class="footer-sf-link">
              Customer Storefront ↗
            </a>
          </div>
        </div>
      </footer>
    }
  `,
  styles: [`
    .admin-footer {
      border-top: 1px solid var(--line, #EADFCF);
      background: rgba(251, 246, 239, 0.6);
      padding: 16px 24px;
      font-size: 12px;
      color: var(--wood-700, #5C4530);
      margin-top: auto;
    }
    .admin-footer-wrap {
      max-width: 1240px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }
    .brand-sub {
      color: var(--wood-800, #3B2A20);
    }
    .footer-right {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 11.5px;
    }
    .system-tag {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: #166534;
      font-weight: 500;
    }
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #16A34A;
      display: inline-block;
    }
    .sep {
      color: var(--wood-400, #A9764F);
    }
    .footer-sf-link {
      color: var(--wood-500, #8A4B2E);
      text-decoration: none;
      font-weight: 600;
      transition: color 0.15s ease;
    }
    .footer-sf-link:hover {
      color: var(--wood-800, #3B2A20);
      text-decoration: underline;
    }
  `],
})
export class FooterComponent {
  readonly storefrontUrl = STOREFRONT_URL;
  readonly adminAuth = inject(AdminAuthService);
  readonly year = new Date().getFullYear();
}
