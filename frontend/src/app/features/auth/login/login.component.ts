import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="wrap section">
      <div class="eyebrow">Account</div>
      <h1 class="serif" style="font-size:32px;font-weight:500;margin:10px 0 30px;">My Account</h1>

      <div class="acc-tabs">
        <button class="tab-btn active" type="button">Login</button>
        <a class="tab-btn" routerLink="/account/register" style="display:inline-block;">Register</a>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" style="max-width:380px;">
        <div class="field"><label>Email</label><input type="email" formControlName="email" /></div>
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
</div>        <button type="submit" class="btn btn-primary btn-block" [disabled]="form.invalid">Log In</button>

<p style="margin-top:15px;">
  <a routerLink="/account/forgot-password">
    Forgot Password?
  </a>
</p>
      </form>
    </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  showPassword = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) return;
    this.auth.login(this.form.getRawValue() as { email: string; password: string }).subscribe(() => {
      this.router.navigate(['/account']);
    });
  }
}
