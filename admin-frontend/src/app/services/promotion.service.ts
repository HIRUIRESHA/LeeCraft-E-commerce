import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Promotion, PromotionRequest } from '../models/promotion.model';

@Injectable({ providedIn: 'root' })
export class PromotionService {
  private readonly baseUrl = `${environment.apiUrl}/promotions`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(this.baseUrl);
  }

  getById(id: number): Observable<Promotion> {
    return this.http.get<Promotion>(`${this.baseUrl}/${id}`);
  }

  create(request: PromotionRequest): Observable<Promotion> {
    return this.http.post<Promotion>(this.baseUrl, request);
  }

  update(id: number, request: PromotionRequest): Observable<Promotion> {
    return this.http.put<Promotion>(`${this.baseUrl}/${id}`, request);
  }

  toggleStatus(id: number): Observable<Promotion> {
    return this.http.patch<Promotion>(`${this.baseUrl}/${id}/toggle`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
