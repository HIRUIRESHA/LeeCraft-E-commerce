import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CheckoutRequest, Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  place(req: CheckoutRequest): Observable<Order> {
    if (environment.useMockData) {
      const mockOrder: Order = {
        id: 'LC-' + Math.floor(10000 + Math.random() * 89999),
        status: 'PLACED',
        total: 0,
        createdAt: new Date().toISOString(),
      };
      return of(mockOrder).pipe(delay(400));
    }
    return this.http.post<Order>(`${environment.apiUrl}/orders`, req);
  }
}
