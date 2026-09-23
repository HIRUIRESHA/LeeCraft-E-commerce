import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PromotionItem {
  id: number;
  title: string;
  description?: string;
  code?: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usageCount?: number;
  active: boolean;
  validNow?: boolean;
  bannerUrl?: string;
}

export interface PromotionValidationResponse {
  code: string;
  title: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  discountAmount: number;
  finalAmount: number;
  valid: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  private readonly apiUrl = `${environment.apiUrl}/promotions`;

  constructor(private http: HttpClient) {}

  getActivePromotions(): Observable<PromotionItem[]> {
    return this.http.get<PromotionItem[]>(this.apiUrl);
  }

  validatePromotion(code: string, orderAmount: number): Observable<PromotionValidationResponse> {
    return this.http.post<PromotionValidationResponse>(`${this.apiUrl}/validate`, {
      code,
      orderAmount,
    });
  }
}
