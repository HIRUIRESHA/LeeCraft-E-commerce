import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ContactMessage } from '../models/contact-message.model';

@Injectable({ providedIn: 'root' })
export class ContactMessageService {
  private readonly baseUrl = `${environment.apiUrl}/admin/contact-messages`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(this.baseUrl);
  }

  markAsRead(id: number): Observable<ContactMessage> {
    return this.http.patch<ContactMessage>(`${this.baseUrl}/${id}/read`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
