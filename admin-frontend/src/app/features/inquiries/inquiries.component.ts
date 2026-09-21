import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactMessage } from '../../models/contact-message.model';
import { ContactMessageService } from '../../services/contact-message.service';

@Component({
  selector: 'app-inquiries',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="wrap section">
      <div class="eyebrow">Admin</div>
      <h1 class="serif" style="font-size:30px;font-weight:500;margin:10px 0 16px;">
        Customer Inquiries
      </h1>

      @if (errorMessage) {
        <p style="color:#b3261e;font-size:13px;margin-bottom:12px;">
          {{ errorMessage }}
        </p>
      }

      <div class="card" style="padding:0;overflow:hidden;">
        <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
          <thead>
            <tr style="border-bottom:1px solid var(--line);text-align:left;">
              <th style="padding:12px 16px;">From</th>
              <th style="padding:12px 16px;">Message</th>
              <th style="padding:12px 16px;">Received</th>
              <th style="padding:12px 16px;">Status</th>
              <th style="padding:12px 16px;"></th>
            </tr>
          </thead>
          <tbody>
            @for (m of messages; track m.id) {
              <tr style="border-bottom:1px solid var(--line);">
                <td style="padding:10px 16px;">
                  <div style="font-weight:600;">{{ m.name }}</div>
                  <div style="font-size:12px;color:var(--wood-400);">{{ m.email }}</div>
                </td>
                <td style="padding:10px 16px;max-width:360px;color:var(--wood-700);">
                  {{ m.message }}
                </td>
                <td style="padding:10px 16px;color:var(--wood-400);font-size:12px;white-space:nowrap;">
                  {{ m.createdAt | date:'mediumDate' }}
                </td>
                <td style="padding:10px 16px;">
                  @if (m.read) {
                    <span class="badge" style="background:#E6EFE6;color:var(--ok);">Read</span>
                  } @else {
                    <span class="badge" style="background:#FDF3E3;color:#8A6D3B;">New</span>
                  }
                </td>
                <td style="padding:10px 16px;text-align:right;white-space:nowrap;">
                  @if (!m.read) {
                    <button class="btn" (click)="markRead(m)">Mark Read</button>
                  }
                  <button class="btn" (click)="remove(m.id)">Delete</button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5" style="padding:16px;text-align:center;color:var(--wood-400);">
                  No inquiries yet.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </main>
  `,
})
export class InquiriesComponent implements OnInit {
  private contactMessageService = inject(ContactMessageService);

  messages: ContactMessage[] = [];
  errorMessage = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.contactMessageService.getAll().subscribe({
      next: (data) => (this.messages = data),
      error: () =>
        (this.errorMessage = 'Failed to load inquiries. Is the backend running?'),
    });
  }

  markRead(message: ContactMessage): void {
    this.contactMessageService.markAsRead(message.id).subscribe({
      next: (updated) => (message.read = updated.read),
      error: () => (this.errorMessage = 'Failed to mark message as read.'),
    });
  }

  remove(id: number): void {
    if (!confirm('Delete this inquiry?')) return;
    this.contactMessageService.delete(id).subscribe({
      next: () => this.load(),
      error: () => (this.errorMessage = 'Delete failed.'),
    });
  }
}
