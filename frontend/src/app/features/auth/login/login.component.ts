import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="wrap section">

      <div class="eyebrow">Account</div>

      <h1
        class="serif"
        style="font-size:32px;font-weight:500;margin:10px 0 30px;"
      >
        My Account
      </h1>

      <div class="acc-tabs">

        <button
          class="tab-btn active"
          type="button"
        >
          Login
        </button>

        <a
          class="tab-btn"
          routerLink="/account/register"
          style="display:inline-block;"
        >
          Register
        </a>

      </div>

      @if (errorMessage) {
        <div style="
          max-width:380px;
          background:#FBEAE8;
          color:var(--danger);
          border:1px solid #f0c3be;
          padding:12px 16px;
          border-radius:4px;
          margin-bottom:20px;
          font-size:13.5px;
          line-height:1.5;
        ">
          <div>{{ errorMessage }}</div>

          @if (needsVerification) {
            <div style="margin-top:10px;">
              <a
                [routerLink]="['/account/verify']"
                [queryParams]="{ email: unverifiedEmail }"
                class="btn btn-primary btn-sm"
                style="display:inline-flex;text-transform:none;letter-spacing:normal;"
              >
                Verify Email Now &rarr;
              </a>
            </div>
          }
        </div>
      }

      <form
        [formGroup]="form"
        (ngSubmit)="submit()"
        style="max-width:380px;"
      >

        <div class="field">
          <label>Email</label>

          <input
            type="email"
            formControlName="email"
            placeholder="name@example.com"
          />
        </div>

        <div class="field">

          <label>Password</label>

          <div style="position:relative;">

            <input
              [type]="showPassword ? 'text' : 'password'"
              formControlName="password"
              style="padding-right:60px;"
            />

            <button
              type="button"
              (click)="showPassword = !showPassword"
              style="
                position:absolute;
                right:10px;
                top:50%;
                transform:translateY(-50%);
                border:none;
                background:none;
                cursor:pointer;
                color:var(--wood-500);
                font-size:12px;
              "
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>

          </div>

        </div>

        <button
          type="submit"
          class="btn btn-primary btn-block"
          [disabled]="form.invalid || isSubmitting"
        >
          {{ isSubmitting ? 'Logging in...' : 'Log In' }}
        </button>

        <div style="margin-top:15px;display:flex;justify-content:space-between;font-size:13px;">
          <a routerLink="/account/forgot-password">
            Forgot Password?
          </a>

          <a
            [routerLink]="['/account/verify']"
            [queryParams]="form.value.email ? { email: form.value.email } : null"
            style="color:var(--wood-700);"
          >
            Verify Email
          </a>
        </div>

      </form>

    </div>
  `,
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  showPassword = false;
  isSubmitting = false;
  errorMessage: string | null = null;
  needsVerification = false;
  unverifiedEmail = '';

  form = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      Validators.required
    ],
  });

  submit(): void {

    if (this.form.invalid) {
      return;
    }

    this.errorMessage = null;
    this.needsVerification = false;
    this.isSubmitting = true;

    const credentials = this.form.getRawValue() as {
      email: string;
      password: string;
    };

    this.auth
      .login(credentials)
      .subscribe({

        next: () => {
          this.isSubmitting = false;

          const returnUrl =
            this.route.snapshot.queryParamMap
              .get('returnUrl');

          const target =
            returnUrl && returnUrl.startsWith('/')
              ? returnUrl
              : '/account';

          this.router.navigateByUrl(target);
        },

        error: (error) => {
          this.isSubmitting = false;

          console.error(
            'Login failed:',
            error
          );

          const msg =
            error?.error?.message ||
            (typeof error?.error === 'string' ? error.error : null) ||
            error?.message ||
            'Login failed. Please check your email and password.';

          this.errorMessage = msg;

          if (msg.toLowerCase().includes('verify your email') || msg.toLowerCase().includes('email is not verified')) {
            this.needsVerification = true;
            this.unverifiedEmail = credentials.email;
          }
        }

      });
  }
}