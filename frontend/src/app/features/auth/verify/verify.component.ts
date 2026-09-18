import { Component, inject } from '@angular/core';
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
        style="font-size:32px;font-weight:500;margin:10px 0 30px;"
      >
        Verify Email
      </h1>

      <p style="max-width:380px;margin-bottom:25px;">
        We sent a verification code to your email address.
        Please enter the 6-digit code below.
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
          />
        </div>

        <div class="field">
          <label>Verification Code</label>

          <input
            type="text"
            formControlName="code"
            maxlength="6"
            placeholder="Enter 6-digit code"
          />
        </div>

        <button
          type="submit"
          class="btn btn-primary btn-block"
          [disabled]="form.invalid"
        >
          Verify Email
        </button>

      </form>

      <p style="margin-top:20px;">
        Already verified?
        <a routerLink="/account/login">
          Login
        </a>
      </p>

    </div>
  `,
})
export class VerifyComponent {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

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
    ]
  });

  submit(): void {

    if (this.form.invalid) {
      return;
    }

    const email = this.form.value.email!;
    const code = this.form.value.code!;

    this.auth.verifyEmail(email, code).subscribe({
      next: (message) => {
        console.log(message);

        alert('Email verified successfully!');

        this.router.navigate(['/account/login']);
      },

      error: (error) => {
        console.error('Email verification failed:', error);

        alert(
          error?.error ||
          'Invalid or expired verification code.'
        );
      }
    });
  }
}