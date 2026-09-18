import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="wrap section">

      <div class="eyebrow">Account</div>

      <h1
        class="serif"
        style="font-size:32px;font-weight:500;margin:10px 0 20px;"
      >
        Reset Password
      </h1>

      <p style="max-width:380px;margin-bottom:25px;">
        Enter the 6-digit code sent to your email and
        create a new password.
      </p>

      <form
        [formGroup]="form"
        (ngSubmit)="submit()"
        style="max-width:380px;"
      >

        <!-- Email -->
        <div class="field">
          <label>Email</label>

          <input
            type="email"
            formControlName="email"
          />
        </div>

        <!-- Reset Code -->
        <div class="field">
          <label>Reset Code</label>

          <input
            type="text"
            formControlName="code"
            maxlength="6"
            placeholder="Enter 6-digit code"
          />
        </div>

        <!-- New Password -->
        <div class="field">
          <label>New Password</label>

          <div style="position: relative;">

            <input
              [type]="showPassword ? 'text' : 'password'"
              formControlName="newPassword"
              placeholder="Enter new password"
              style="padding-right:70px; width:100%;"
            />

            <button
              type="button"
              (click)="showPassword = !showPassword"
              style="
                position:absolute;
                right:12px;
                top:50%;
                transform:translateY(-50%);
                border:none;
                background:transparent;
                cursor:pointer;
                font-size:14px;
                font-weight:500;
              "
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>

          </div>
        </div>

        <!-- Reset Password Button -->
        <button
          type="submit"
          class="btn btn-primary btn-block"
          [disabled]="form.invalid"
        >
          Reset Password
        </button>

      </form>

      <p style="margin-top:20px;">
        Remember your password?

        <a routerLink="/account/login">
          Login
        </a>
      </p>

    </div>
  `,
})
export class ResetPasswordComponent {

private fb = inject(FormBuilder);
private route = inject(ActivatedRoute);
private router = inject(Router);
private auth = inject(AuthService);

showPassword = false;

  form = this.fb.group({

    email: [
      this.route.snapshot.queryParamMap.get('email') || '',
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
    ],

    newPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(8)
      ]
    ]

  });

  submit(): void {

  if (this.form.invalid) {
    return;
  }

  const { email, code, newPassword } = this.form.getRawValue();

  this.auth.resetPassword(
    email!,
    code!,
    newPassword!
  ).subscribe({

    next: (message: string) => {

      console.log('Password reset:', message);

      alert(
        'Password reset successfully. You can now login with your new password.'
      );

      this.router.navigate(['/account/login']);
    },

    error: (error: any) => {

      console.error('Password reset failed:', error);

      alert(
        error?.error ||
        'Unable to reset password.'
      );
    }

  });
}
}