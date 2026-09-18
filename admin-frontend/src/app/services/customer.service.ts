import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminCustomer {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  active: boolean;
  emailVerified: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/admin/customers`;

  getCustomers(): Observable<AdminCustomer[]> {
    return this.http.get<AdminCustomer[]>(this.baseUrl);
  }

  updateStatus(id: number, active: boolean): Observable<AdminCustomer> {
    return this.http.patch<AdminCustomer>(`${this.baseUrl}/${id}/status`, {
      active,
    });
  }
}
