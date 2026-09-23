import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CheckoutRequest, Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  place(req: CheckoutRequest): Observable<Order> {
    return this.http.post<Order>(`${environment.apiUrl}/orders`, req);
  }

  getByOrderNumber(orderNumber: string): Observable<Order> {
    return this.http.get<Order>(`${environment.apiUrl}/orders/${orderNumber}`);
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/user/orders`);
  }

  trackOrder(orderNumber: string, contact: string): Observable<Order> {
    const params = new HttpParams()
      .set('orderNumber', orderNumber.trim())
      .set('contact', contact.trim());
    return this.http.get<Order>(`${environment.apiUrl}/orders/track`, { params });
  }
}
