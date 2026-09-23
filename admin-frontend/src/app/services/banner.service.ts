import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Banner, BannerRequest } from '../models/banner.model';

@Injectable({ providedIn: 'root' })
export class BannerService {
  private readonly baseUrl = `${environment.apiUrl}/admin/banners`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Banner[]> {
    return this.http.get<Banner[]>(this.baseUrl);
  }

  getById(id: number): Observable<Banner> {
    return this.http.get<Banner>(`${this.baseUrl}/${id}`);
  }

  create(request: BannerRequest): Observable<Banner> {
    return this.http.post<Banner>(this.baseUrl, request);
  }

  update(id: number, request: BannerRequest): Observable<Banner> {
    return this.http.put<Banner>(`${this.baseUrl}/${id}`, request);
  }

  setActive(id: number, active: boolean): Observable<Banner> {
    return this.http.patch<Banner>(`${this.baseUrl}/${id}/active`, { active });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
