import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotificationService } from '../../core/services/notification.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="toast-stack">
      <div
        *ngFor="let toast of notify.toasts()"
        class="toast-item"
        [class]="'toast-' + toast.type"
      >
        <span class="toast-icon" [ngSwitch]="toast.type">
          <svg *ngSwitchCase="'success'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
          <svg *ngSwitchCase="'error'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          <svg *ngSwitchDefault width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </span>
        <span class="toast-text">{{ toast.text }}</span>
        <button class="toast-close" type="button" (click)="notify.dismiss(toast.id)" aria-label="Dismiss">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>
  `,
    styles: [`
    .toast-stack{
      position:fixed;
      top:88px;
      right:20px;
      z-index:200;
      display:flex;
      flex-direction:column;
      gap:10px;
      max-width:340px;
    }
    .toast-item{
      display:flex;
      align-items:flex-start;
      gap:10px;
      background:#FFFEFB;
      border:1px solid #EADFCF;
      border-left:4px solid var(--wood-500,#8A4B2E);
      box-shadow:0 12px 30px rgba(42,29,20,.18);
      padding:13px 14px;
      border-radius:3px;
      font-size:13.5px;
      line-height:1.5;
      color:#3B2A20;
      animation:toastIn .25s cubic-bezier(.2,.7,.2,1);
    }
    .toast-success{ border-left-color:#4C7A4C; }
    .toast-error{ border-left-color:#B44C3C; }
    .toast-info{ border-left-color:#8A4B2E; }
    .toast-icon{ flex-shrink:0; margin-top:1px; }
    .toast-success .toast-icon{ color:#4C7A4C; }
    .toast-error .toast-icon{ color:#B44C3C; }
    .toast-info .toast-icon{ color:#8A4B2E; }
    .toast-text{ flex:1; }
    .toast-close{
      background:none;
      border:none;
      padding:2px;
      color:#A9764F;
      display:flex;
      flex-shrink:0;
      cursor:pointer;
    }
    .toast-close:hover{ color:#3B2A20; }
    @keyframes toastIn{
      from{ opacity:0; transform:translate3d(16px,0,0); }
      to{ opacity:1; transform:translate3d(0,0,0); }
    }
    @media (max-width:860px){
      .toast-stack{ right:12px; left:12px; max-width:none; top:76px; }
    }
  `],
})
export class ToastComponent {
    protected readonly notify = inject(NotificationService);
}