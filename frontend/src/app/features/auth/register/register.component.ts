
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
          />
        </div>

        <div class="field">
          <label>Email</label>

          <input
            type="email"
            formControlName="email"
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
      "
    >
      {{ showPassword ? 'Hide' : 'Show' }}
    </button>
  </div>
</div>

        <button
          type="submit"
          class="btn btn-primary btn-block"
          [disabled]="form.invalid"
        >
          Create Account
        </button>

      </form>

    </div>
  `,
})
export class RegisterComponent {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

   showPassword = false;

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

          console.error(
            'Registration failed:',
            error
          );

          alert(
            error?.error ||
            'Registration failed.'
          );

        }

      });

  }

}
