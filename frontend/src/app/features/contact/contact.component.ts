import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="wrap section page-narrow">
      <div class="eyebrow">Contact Us</div>
      <h1 class="serif">Get In Touch</h1>

      @if (!auth.isAuthenticated()) {
        <div style="
          background:#FDF3E3;
          color:#8A6D3B;
          border:1px solid #faebcc;
          padding:12px 16px;
          border-radius:4px;
          margin-bottom:20px;
          font-size:13.5px;
          line-height:1.5;
        ">
          Please <a routerLink="/account/login" [queryParams]="{ returnUrl: '/contact' }" style="font-weight:600;text-decoration:underline;color:#8A4B2E;">log in to your account</a> before sending us an inquiry.
        </div>
      }

      <form #contactForm="ngForm" (ngSubmit)="submit(contactForm)">
        <div class="field">
          <label>Name</label>
          <input
            type="text"
            name="name"
            [ngModel]="auth.user()?.fullName || ''"
            required
            placeholder="Your Full Name"
          />
        </div>

        <div class="field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            [ngModel]="auth.user()?.email || ''"
            required
            email
            placeholder="name@example.com"
          />
        </div>

        <div class="field">
          <label>Message</label>
          <textarea
            name="message"
            ngModel
            required
            placeholder="How can we help you?"
          ></textarea>
        </div>

        <button class="btn btn-primary" type="submit">
          Send Message
        </button>
      </form>

      <p class="reach">
        Or reach us at <a href="mailto:hello@leecraft.lk">hello&#64;leecraft.lk</a> / +94 77 123 4567
      </p>
    </section>
  `,
  styles: [`
    .page-narrow{max-width:560px;}
    h1.serif{font-size:32px;font-weight:500;margin:10px 0 26px;}
    .field{margin-bottom:18px;}
    .field label{display:block;font-size:12.5px;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;color:var(--wood-700);}
    .field input,.field textarea{width:100%;padding:11px 13px;border:1px solid var(--line);font-size:13.5px;background:#fff;box-sizing:border-box;}
    .field textarea{resize:vertical;min-height:110px;}
    .reach{margin-top:26px;font-size:13.5px;color:var(--wood-700);}
  `],
})
export class ContactComponent {
  readonly auth = inject(AuthService);
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);

  submit(form: NgForm): void {
    if (!this.auth.isAuthenticated()) {
      this.notify.error('Please log in to send us a message.');
      this.router.navigate(['/account/login'], {
        queryParams: { returnUrl: '/contact' },
      });
      return;
    }

    if (form.invalid) {
      form.control.markAllAsTouched();
      this.notify.error('Please fill in all fields correctly.');
      return;
    }

    this.notify.success('Message sent — we will get back to you shortly.');
    form.resetForm();
  }
}