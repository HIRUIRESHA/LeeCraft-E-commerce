import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="wrap section">

      <div class="eyebrow">Account</div>

      <h1
        class="serif"
        style="font-size:32px;font-weight:500;margin:10px 0 20px;"
      >
        Verify Email
      </h1>

      <p style="max-width:420px;margin-bottom:20px;color:var(--wood-700);line-height:1.6;">
        We sent a 6-digit verification code to your email.
        Please enter the code below. <strong>Codes expire in 5 minutes.</strong>
      </p>

      @if (successMessage) {
        <div style="
          max-width:420px;
          background:#E6EFE6;
          color:var(--ok);
          border:1px solid #c3dec3;
          padding:12px 16px;
          border-radius:4px;
          margin-bottom:20px;
          font-size:13.5px;
        ">
          {{ successMessage }}
        </div>
      }

      @if (errorMessage) {
        <div style="
          max-width:420px;
          background:#FBEAE8;
          color:var(--danger);
          border:1px solid #f0c3be;
          padding:12px 16px;
          border-radius:4px;
          margin-bottom:20px;
          font-size:13.5px;
        ">
          {{ errorMessage }}
        </div>
      }

      <form
        [formGroup]="form"
        (ngSubmit)="submit()"
        style="max-width:420px;"
      >

        <div class="field">
          <label>Email Address</label>

          <input
            type="email"
            formControlName="email"
            placeholder="name@example.com"
          />
        </div>

        <div class="field">
          <label>6-Digit Verification Code</label>

          <input
            type="text"
            formControlName="code"
            maxlength="6"
            placeholder="123456"
            style="letter-spacing:4px;font-size:18px;text-align:center;font-weight:600;"
          />
        </div>

        <button
          type="submit"
          class="btn btn-primary btn-block"
          [disabled]="form.invalid || isSubmitting"
          style="margin-top:10px;"
        >
          {{ isSubmitting ? 'Verifying...' : 'Verify Email' }}
        </button>

        <div style="
          margin-top:20px;
          padding-top:18px;
          border-top:1px solid var(--line);
          display:flex;
          align-items:center;
          justify-content:space-between;
          font-size:13px;
        ">
          <span style="color:var(--wood-700);">Didn't receive the code?</span>

          <button
            type="button"
            class="btn btn-outline btn-sm"
            (click)="resendCode()"
            [disabled]="resendCooldown > 0 || isResending"
          >
            @if (isResending) {
              Sending...
            } @else if (resendCooldown > 0) {
              Resend in {{ resendCooldown }}s
            } @else {
              Resend Code
            }
          </button>
        </div>

      </form>

      <p style="margin-top:24px;font-size:13.5px;color:var(--wood-700);">
        Already verified?
        <a routerLink="/account/login" style="font-weight:500;text-decoration:underline;">
          Log In
        </a>
        &nbsp;&bull;&nbsp;
        <a routerLink="/account/register" style="color:var(--wood-700);">
          Register with another email
        </a>
      </p>

    </div>
  `,
})
export class VerifyComponent implements OnInit, OnDestroy {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isSubmitting = false;
  isResending = false;
  resendCooldown = 0;
  private timerId: ReturnType<typeof setInterval> | null = null;

  errorMessage: string | null = null;
  successMessage: string | null = null;

  form = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    code: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{6}$/)
      ]
    ]
  });

  ngOnInit(): void {
    const emailParam = this.route.snapshot.queryParamMap.get('email');
    if (emailParam) {
      this.form.patchValue({ email: emailParam });
    }
  }

  ngOnDestroy(): void {
    this.clearCooldownTimer();
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;
    this.isSubmitting = true;

    const email = this.form.value.email!.trim();
    const code = this.form.value.code!.trim();

    this.auth.verifyEmail(email, code).subscribe({
      next: (message) => {
        this.isSubmitting = false;
        alert(message || 'Email verified successfully! You can now log in.');
        this.router.navigate(['/account/login']);
      },

      error: (error) => {
        this.isSubmitting = false;
        console.error('Email verification failed:', error);

        const msg =
          error?.error?.message ||
          (typeof error?.error === 'string' ? error.error : null) ||
          error?.message ||
          'Invalid or expired verification code.';

        this.errorMessage = msg;
      }
    });
  }

  resendCode(): void {
    const email = this.form.value.email?.trim();

    if (!email) {
      this.errorMessage = 'Please enter your email address to resend the code.';
      return;
    }

    if (this.resendCooldown > 0 || this.isResending) {
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;
    this.isResending = true;

    this.auth.resendVerificationCode(email).subscribe({
      next: (response) => {
        this.isResending = false;
        this.successMessage =
          response ||
          'A new 6-digit verification code has been sent to your email.';
        this.startCooldown(60);
      },

      error: (error) => {
        this.isResending = false;
        console.error('Resend verification code failed:', error);

        const msg =
          error?.error?.message ||
          (typeof error?.error === 'string' ? error.error : null) ||
          error?.message ||
          'Failed to resend verification code. Please try again.';

        this.errorMessage = msg;
      }
    });
  }

  private startCooldown(seconds: number): void {
    this.resendCooldown = seconds;
    this.clearCooldownTimer();

    this.timerId = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) {
        this.clearCooldownTimer();
      }
    }, 1000);
  }

  private clearCooldownTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}