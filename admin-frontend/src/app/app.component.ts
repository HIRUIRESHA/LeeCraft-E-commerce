import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AdminAuthService } from './services/admin-auth.service';
import { AdminUiService } from './services/admin-ui.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'admin-frontend';
  readonly adminAuth = inject(AdminAuthService);
  readonly ui = inject(AdminUiService);
}
