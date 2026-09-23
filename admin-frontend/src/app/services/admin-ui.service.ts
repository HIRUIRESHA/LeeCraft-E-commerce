import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdminUiService {
  readonly isSidebarCollapsed = signal<boolean>(false);
  readonly isMobileMenuOpen = signal<boolean>(false);

  toggleSidebarCollapsed(): void {
    this.isSidebarCollapsed.update((v) => !v);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
