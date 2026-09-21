import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SiteContentService {
  private readonly apiUrl = `${environment.apiUrl}/content`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Record<string, string>> {
    return this.http.get<Record<string, string>>(this.apiUrl);
  }
}
