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
      <h1 class="serif" style="font-size:32px;font-weight:500;margin:10px 0 30px;">My Account</h1>

      <div class="acc-tabs">
        <a class="tab-btn" routerLink="/account/login" style="display:inline-block;">Login</a>
        <button class="tab-btn active" type="button">Register</button>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" style="max-width:380px;">
        <div class="field"><label>Full Name</label><input type="text" formControlName="fullName" /></div>
        <div class="field"><label>Email</label><input type="email" formControlName="email" /></div>
        <div class="field"><label>Password</label><input type="password" formControlName="password" /></div>
        <button type="submit" class="btn btn-primary btn-block" [disabled]="form.invalid">Create Account</button>
      </form>
    </div>
  `,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  submit(): void {
    if (this.form.invalid) return;
    this.auth
      .register(this.form.getRawValue() as { fullName: string; email: string; password: string })
      .subscribe(() => this.router.navigate(['/account']));
  }
}
