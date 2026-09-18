import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
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

        <a
          class="tab-btn"
          routerLink="/account/login"
          style="display:inline-block;"
        >
          Login
        </a>

        <button
          class="tab-btn active"
          type="button"
        >
          Register
        </button>

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
          {{ errorMessage }}
        </div>
      }

      <form
        [formGroup]="form"
        (ngSubmit)="submit()"
        style="max-width:380px;"
      >

        <div class="field">
          <label>Full Name</label>

          <input
            type="text"
            formControlName="fullName"
            placeholder="John Doe"
          />
        </div>

        <div class="field">
          <label>Email</label>

          <input
            type="email"
            formControlName="email"
            placeholder="name@example.com"
          />
        </div>

        <div class="field">
          <label>Phone</label>

          <input
            type="tel"
            formControlName="phone"
            placeholder="07XXXXXXXX"
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
          {{ isSubmitting ? 'Creating Account...' : 'Create Account' }}
        </button>

        <p style="margin-top:15px;font-size:13px;color:var(--wood-700);">
          Already have an account?
          <a routerLink="/account/login" style="font-weight:500;">
            Log In
          </a>
        </p>

      </form>

    </div>
  `,
})
export class RegisterComponent {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  showPassword = false;
  isSubmitting = false;
  errorMessage: string | null = null;

  form = this.fb.group({

    fullName: [
      '',
      Validators.required
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    phone: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?:\+94|0)7\d{8}$/)
      ]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8)
      ]
    ],

  });

  submit(): void {

    if (this.form.invalid) {
      return;
    }

    this.errorMessage = null;
    this.isSubmitting = true;

    const data = this.form.getRawValue();

    this.auth
      .register(
        data as {
          fullName: string;
          email: string;
          phone: string;
          password: string;
        }
      )
      .subscribe({

        next: () => {
          this.isSubmitting = false;

          this.router.navigate(
            ['/account/verify'],
            {
              queryParams: {
                email: data.email
              }
            }
          );

        },

        error: (error) => {
          this.isSubmitting = false;

          console.error(
            'Registration failed:',
            error
          );

          let msg =
            error?.error?.message ||
            (typeof error?.error === 'string' ? error.error : null) ||
            error?.message ||
            'Registration failed.';

          if (error?.error?.fieldErrors) {
            const keys = Object.keys(error.error.fieldErrors);
            if (keys.length > 0) {
              msg = error.error.fieldErrors[keys[0]];
            }
          }

          this.errorMessage = msg;

        }

      });

  }

}
