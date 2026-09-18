import { AuthService } from '../../../core/services/auth.service';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="wrap section">

      <div class="eyebrow">Account</div>

      <h1
        class="serif"
        style="font-size:32px;font-weight:500;margin:10px 0 20px;"
      >
        Forgot Password
      </h1>

      <p style="max-width:380px;margin-bottom:25px;">
        Enter your email address and we will send you a
        password reset code.
      </p>

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
            placeholder="Enter your email"
          />
        </div>

        <button
          type="submit"
          class="btn btn-primary btn-block"
          [disabled]="form.invalid"
        >
          Send Reset Code
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
export class ForgotPasswordComponent {

  private fb = inject(FormBuilder);
private router = inject(Router);
private auth = inject(AuthService);

  form = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ]
  });

  submit(): void {

  if (this.form.invalid) {
    return;
  }

  const email = this.form.value.email!;

  this.auth.forgotPassword(email).subscribe({

    next: (message) => {

      console.log(message);

      alert(
        'Password reset code has been sent to your email.'
      );

      this.router.navigate(
        ['/account/reset-password'],
        {
          queryParams: {
            email: email
          }
        }
      );
    },

    error: (error) => {

      console.error(
        'Forgot password failed:',
        error
      );

      alert(
        error?.error ||
        'Unable to send password reset code.'
      );
    }

  });
}
}