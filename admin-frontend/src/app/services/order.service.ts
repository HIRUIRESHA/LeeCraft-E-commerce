import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import {
  Order,
  OrderPage,
  OrderStatus,
  OrderStatusUpdateRequest
} from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/admin/orders`;

  getOrders(
    page: number = 0,
    size: number = 20,
    status?: OrderStatus
  ): Observable<OrderPage> {

    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<OrderPage>(
      this.apiUrl,
      { params }
    );
  }

  getOrder(orderNumber: string): Observable<Order> {

    return this.http.get<Order>(
      `${this.apiUrl}/${orderNumber}`
    );
  }

  updateStatus(
    orderNumber: string,
    status: OrderStatus
  ): Observable<Order> {

    const request: OrderStatusUpdateRequest = {
      status
    };

    return this.http.patch<Order>(
      `${this.apiUrl}/${orderNumber}/status`,
      request
    );
  }

  getSalesSummary(): Observable<unknown> {

    return this.http.get(
      `${this.apiUrl}/sales-summary`
    );
  }
}