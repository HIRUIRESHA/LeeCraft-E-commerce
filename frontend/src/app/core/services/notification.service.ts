import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
    id: number;
    type: ToastType;
    text: string;
}

/**
 * NotificationService
 * ---------------------------------------------------------------------------
 * Central place to trigger toast notifications from anywhere in the app
 * (forms, HTTP error handlers, cart actions, etc). The ToastComponent reads
 * the `toasts` signal and renders whatever is currently queued.
 *
 * Usage:
 *   constructor(private notify: NotificationService) {}
 *   this.notify.success('Message sent — we will get back to you shortly.');
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
    private readonly _toasts = signal<ToastMessage[]>([]);
    readonly toasts = this._toasts.asReadonly();

    private nextId = 0;
    private readonly defaultDuration = 3500;

    show(text: string, type: ToastType = 'info', duration: number = this.defaultDuration): void {
        const id = ++this.nextId;
        this._toasts.update((list) => [...list, { id, type, text }]);

        if (duration > 0) {
            setTimeout(() => this.dismiss(id), duration);
        }
    }

    success(text: string, duration?: number): void {
        this.show(text, 'success', duration ?? this.defaultDuration);
    }

    error(text: string, duration?: number): void {
        this.show(text, 'error', duration ?? this.defaultDuration);
    }

    info(text: string, duration?: number): void {
        this.show(text, 'info', duration ?? this.defaultDuration);
    }

    dismiss(id: number): void {
        this._toasts.update((list) => list.filter((t) => t.id !== id));
    }

    clear(): void {
        this._toasts.set([]);
    }
}