import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MOCK_PRODUCTS } from '../data/mock-products';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  list(): Observable<Product[]> {
    if (environment.useMockData) {
      return of(MOCK_PRODUCTS);
    }
    return this.http.get<Product[]>(`${environment.apiUrl}/products`);
  }

  get(id: string): Observable<Product | undefined> {
    if (environment.useMockData) {
      return of(MOCK_PRODUCTS.find((p) => p.id === id));
    }
    return this.http.get<Product>(`${environment.apiUrl}/products/${id}`);
  }
}
