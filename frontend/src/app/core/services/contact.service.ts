import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface ContactMessageRequest {
  name: string;
  email: string;
  message: string;
}

export interface ContactMessageResponse extends ContactMessageRequest {
  id: number;
  read: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly apiUrl = `${environment.apiUrl}/contact`;

  constructor(private http: HttpClient) {}

  submit(request: ContactMessageRequest): Observable<ContactMessageResponse> {
    return this.http.post<ContactMessageResponse>(this.apiUrl, request);
  }
}
