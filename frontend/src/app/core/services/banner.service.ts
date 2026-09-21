import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  displayOrder: number;
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  private readonly apiUrl = `${environment.apiUrl}/banners`;

  constructor(private http: HttpClient) {}

  getActiveBanners(): Observable<Banner[]> {
    return this.http.get<Banner[]>(this.apiUrl);
  }
}
