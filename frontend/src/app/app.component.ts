import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ToastComponent } from './shared/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, ToastComponent],
  template: `
    <app-navbar></app-navbar>

    <main>
      <router-outlet></router-outlet>
    </main>

    <app-footer></app-footer>
    <app-toast></app-toast>
  `,
  styles: [`
    :host{ display:block; min-height:100vh; }
    main{ min-height:60vh; }
  `],
})
export class AppComponent {
  title = 'leecraft-cutting-boards';
}