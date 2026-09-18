import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';

interface BackendProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  material: string;
  size: string;
  shape: string;
  color: string;
  stockQuantity: number;
  categoryId: number;
  categoryName: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  private mapProduct(product: BackendProduct): Product {
    return {
      id: product.id,
      name: product.name,
      description: product.description ?? '',
      price: Number(product.price),

      // Backend imageUrl → frontend image
      image: product.imageUrl || undefined,

      material: product.material,
      size: product.size,
      shape: product.shape,
      color: product.color,

      // Backend currently doesn't have review/rating fields
      rating: 0,
      reviewCount: 0,

      // Convert stock quantity to frontend boolean
      inStock: product.stockQuantity > 0,

      stockQuantity: product.stockQuantity,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
    };
  }

  list(): Observable<Product[]> {
    return this.http
      .get<BackendProduct[]>(this.apiUrl)
      .pipe(
        map((products) => products.map((product) => this.mapProduct(product)))
      );
  }

  get(id: number): Observable<Product> {
    return this.http
      .get<BackendProduct>(`${this.apiUrl}/${id}`)
      .pipe(
        map((product) => this.mapProduct(product))
      );
  }

  search(params: {
    keyword?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    material?: string;
    size?: string;
    shape?: string;
    color?: string;
    inStockOnly?: boolean;
  }): Observable<Product[]> {

    let httpParams = new HttpParams();

    if (params.keyword) {
      httpParams = httpParams.set('keyword', params.keyword);
    }

    if (params.categoryId !== undefined) {
      httpParams = httpParams.set('categoryId', params.categoryId);
    }

    if (params.minPrice !== undefined) {
      httpParams = httpParams.set('minPrice', params.minPrice);
    }

    if (params.maxPrice !== undefined) {
      httpParams = httpParams.set('maxPrice', params.maxPrice);
    }

    if (params.material) {
      httpParams = httpParams.set('material', params.material);
    }

    if (params.size) {
      httpParams = httpParams.set('size', params.size);
    }

    if (params.shape) {
      httpParams = httpParams.set('shape', params.shape);
    }

    if (params.color) {
      httpParams = httpParams.set('color', params.color);
    }

    if (params.inStockOnly !== undefined) {
      httpParams = httpParams.set(
        'inStockOnly',
        params.inStockOnly
      );
    }

    return this.http
      .get<BackendProduct[]>(`${this.apiUrl}/search`, {
        params: httpParams,
      })
      .pipe(
        map((products) =>
          products.map((product) => this.mapProduct(product))
        )
      );
  }
}