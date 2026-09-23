import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SiteContentEntry } from '../models/site-content.model';

@Injectable({ providedIn: 'root' })
export class SiteContentService {
  private readonly baseUrl = `${environment.apiUrl}/admin/content`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<SiteContentEntry[]> {
    return this.http.get<SiteContentEntry[]>(this.baseUrl);
  }

  update(key: string, value: string): Observable<SiteContentEntry> {
    return this.http.put<SiteContentEntry>(`${this.baseUrl}/${key}`, { value });
  }
}
