import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div style="
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    ">
      <div style="
        width: 100%;
        max-width: 420px;
        background: #fff;
        border: 1px solid var(--line);
        padding: 40px 32px;
        border-radius: 6px;
        box-shadow: 0 10px 30px rgba(0,0,0,.05);
      ">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="
            display: inline-flex;
            width: 48px;
            height: 48px;
            background: var(--wood-800);
            color: #fff;
            border-radius: 8px;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-family: 'Fraunces', serif;
            margin-bottom: 12px;
          ">
            L
          </div>
          <h1 class="serif" style="font-size: 26px; margin: 0 0 6px;">
            LeeCraft Admin
          </h1>
          <p style="color: var(--wood-400); font-size: 13px; margin: 0;">
            Sign in with administrator credentials
          </p>
        </div>

        @if (errorMessage) {
          <div style="
            background: #FBEAE8;
            color: var(--danger);
            border: 1px solid #f0c3be;
            padding: 12px 16px;
            border-radius: 4px;
            margin-bottom: 20px;
            font-size: 13.5px;
          ">
            {{ errorMessage }}
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="field">
            <label>Admin Email</label>
            <input
              type="email"
              formControlName="email"
              placeholder="admin@leecraft.lk"
            />
          </div>

          <div class="field">
            <label>Password</label>
            <input
              type="password"
              formControlName="password"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-block"
            [disabled]="form.invalid || isSubmitting"
            style="margin-top: 14px; background: var(--wood-800);"
          >
            {{ isSubmitting ? 'Signing in...' : 'Sign In to Portal' }}
          </button>
        </form>

        <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--line); text-align: center;">
          <span style="font-size: 12px; color: var(--wood-400);">
            Default admin: admin&#64;leecraft.lk / admin123
          </span>
        </div>
      </div>
    </div>
  `,
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private adminAuth = inject(AdminAuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isSubmitting = false;
  errorMessage: string | null = null;

  form = this.fb.group({
    email: ['admin@leecraft.lk', [Validators.required, Validators.email]],
    password: ['admin123', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) return;

    this.errorMessage = null;
    this.isSubmitting = true;

    const { email, password } = this.form.getRawValue();

    this.adminAuth.login(email!, password!).subscribe({
      next: () => {
        this.isSubmitting = false;
        const returnUrl =
          this.route.snapshot.queryParamMap.get('returnUrl') || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Admin login error:', err);
        this.errorMessage =
          err?.error?.message ||
          err?.message ||
          'Invalid administrator credentials.';
      },
    });
  }
}
