import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-account',
  standalone: true,
  template: `
    <div class="wrap section">

      <div class="eyebrow">Account</div>

      <h1
        class="serif"
        style="font-size:32px;font-weight:500;margin:10px 0 30px;"
      >
        My Account
      </h1>

      @if (auth.user(); as user) {

        <div class="acc-layout">

          <nav class="acc-nav">
            <a class="active">Profile</a>
            <a (click)="logout()">Log Out</a>
          </nav>

          <div>
            <p>
              <strong>Name:</strong>
              {{ user.fullName }}
            </p>

            <p>
              <strong>Email:</strong>
              {{ user.email }}
            </p>
          </div>

        </div>
      }

    </div>
  `,
})
export class AccountComponent {

  public auth = inject(AuthService);
  private router = inject(Router);

  logout(): void {
  this.auth.logout();
  this.router.navigate(['/account/login']);

  }
}