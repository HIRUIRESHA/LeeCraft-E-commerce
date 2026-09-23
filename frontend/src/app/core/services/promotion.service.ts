import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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

  validatePromotion(code: string, orderAmount: number): Observable<PromotionValidationResponse> {
    return this.http.post<PromotionValidationResponse>(`${this.apiUrl}/validate`, {
      code,
      orderAmount,
    });
  }
}
