import { Injectable, inject, signal } from '@angular/core';
import { SiteContentService } from './site-content.service';

/** Loads site content (About/Contact copy, homepage headings) once and shares it across components. */
@Injectable({ providedIn: 'root' })
export class SiteContentStore {
  private readonly siteContentService = inject(SiteContentService);

  private readonly content = signal<Record<string, string>>({});
  private loaded = false;

  readonly aboutHeading = () => this.content()['ABOUT_HEADING'] || '';
  readonly aboutBody = () => this.content()['ABOUT_BODY'] || '';
  readonly email = () => this.content()['CONTACT_EMAIL'] || '';
  readonly phone = () => this.content()['CONTACT_PHONE'] || '';
  readonly address = () => this.content()['CONTACT_ADDRESS'] || '';
  readonly homeFeaturedHeading = () => this.content()['HOME_FEATURED_HEADING'] || '';
  readonly homeFeaturedSubheading = () => this.content()['HOME_FEATURED_SUBHEADING'] || '';

  load(): void {
    if (this.loaded) return;
    this.loaded = true;
    this.siteContentService.getAll().subscribe({
      next: (data) => this.content.set(data),
      error: () => {
        this.loaded = false;
      },
    });
  }
}
