import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SiteContentService } from '../../services/site-content.service';
import { SiteContentEntry } from '../../models/site-content.model';

interface ContentField {
  key: string;
  label: string;
  multiline: boolean;
}

const FIELD_GROUPS: { title: string; fields: ContentField[] }[] = [
  {
    title: 'About Page',
    fields: [
      { key: 'ABOUT_HEADING', label: 'Heading', multiline: false },
      { key: 'ABOUT_BODY', label: 'Body Copy', multiline: true },
    ],
  },
  {
    title: 'Contact Page',
    fields: [
      { key: 'CONTACT_EMAIL', label: 'Email', multiline: false },
      { key: 'CONTACT_PHONE', label: 'Phone', multiline: false },
      { key: 'CONTACT_ADDRESS', label: 'Address', multiline: false },
    ],
  },
  {
    title: 'Homepage Featured Section',
    fields: [
      { key: 'HOME_FEATURED_SUBHEADING', label: 'Eyebrow', multiline: false },
      { key: 'HOME_FEATURED_HEADING', label: 'Heading', multiline: false },
    ],
  },
];

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="wrap section">
      <div class="eyebrow">Admin</div>
      <h1 class="serif" style="font-size:30px;font-weight:500;margin:10px 0 16px;">
        Site Content
      </h1>

      @if (feedbackMessage) {
        <p style="color:var(--ok);font-size:13px;margin-bottom:12px;">{{ feedbackMessage }}</p>
      }
      @if (errorMessage) {
        <p style="color:#b3261e;font-size:13px;margin-bottom:12px;">{{ errorMessage }}</p>
      }

      @for (group of groups; track group.title) {
        <div class="card" style="padding:22px;max-width:640px;margin-bottom:20px;">
          <h2 style="font-size:17px;font-weight:600;margin:0 0 16px;">{{ group.title }}</h2>
          @for (field of group.fields; track field.key) {
            <div style="margin-bottom:14px;">
              <label style="display:block;font-size:12.5px;margin-bottom:4px;">{{ field.label }}</label>
              @if (field.multiline) {
                <textarea
                  rows="5"
                  [(ngModel)]="values[field.key]"
                  style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;"
                ></textarea>
              } @else {
                <input
                  type="text"
                  [(ngModel)]="values[field.key]"
                  style="width:100%;padding:8px;border:1px solid var(--line);border-radius:6px;"
                />
              }
            </div>
          }
          <button type="button" class="btn" [disabled]="saving" (click)="saveGroup(group)">
            Save {{ group.title }}
          </button>
        </div>
      }
    </main>
  `,
})
export class ContentComponent implements OnInit {
  private siteContentService = inject(SiteContentService);

  readonly groups = FIELD_GROUPS;
  values: Record<string, string> = {};
  saving = false;
  feedbackMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.siteContentService.getAll().subscribe({
      next: (entries: SiteContentEntry[]) => {
        this.values = {};
        entries.forEach((e) => (this.values[e.key] = e.value ?? ''));
      },
      error: () => (this.errorMessage = 'Failed to load site content.'),
    });
  }

  saveGroup(group: { title: string; fields: ContentField[] }): void {
    this.saving = true;
    this.feedbackMessage = '';
    this.errorMessage = '';

    const updates = group.fields.map((field) =>
      this.siteContentService.update(field.key, this.values[field.key] ?? ''),
    );

    let remaining = updates.length;
    updates.forEach((update) =>
      update.subscribe({
        next: () => {
          remaining -= 1;
          if (remaining === 0) {
            this.saving = false;
            this.feedbackMessage = `${group.title} updated.`;
          }
        },
        error: () => {
          this.saving = false;
          this.errorMessage = `Failed to save ${group.title}.`;
        },
      }),
    );
  }
}
