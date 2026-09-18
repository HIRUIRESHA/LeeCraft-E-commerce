import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  phone: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserAddress {
  id: number;
  recipientName: string;
  phone: string;
  streetAddress: string;
  city: string;
  postalCode?: string;
  isDefault: boolean;
}

export interface AddressRequest {
  recipientName: string;
  phone: string;
  streetAddress: string;
  city: string;
  postalCode?: string;
  isDefault: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private http = inject(HttpClient);

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${environment.apiUrl}/user/profile`, {
      withCredentials: true,
    });
  }

  updateProfile(req: UpdateProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${environment.apiUrl}/user/profile`, req, {
      withCredentials: true,
    });
  }

  changePassword(req: ChangePasswordRequest): Observable<string> {
    return this.http.put(
      `${environment.apiUrl}/user/profile/change-password`,
      req,
      {
        withCredentials: true,
        responseType: 'text',
      }
    );
  }

  getAddresses(): Observable<UserAddress[]> {
    return this.http.get<UserAddress[]>(`${environment.apiUrl}/user/addresses`, {
      withCredentials: true,
    });
  }

  addAddress(req: AddressRequest): Observable<UserAddress> {
    return this.http.post<UserAddress>(`${environment.apiUrl}/user/addresses`, req, {
      withCredentials: true,
    });
  }

  updateAddress(id: number, req: AddressRequest): Observable<UserAddress> {
    return this.http.put<UserAddress>(`${environment.apiUrl}/user/addresses/${id}`, req, {
      withCredentials: true,
    });
  }

  deleteAddress(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/user/addresses/${id}`, {
      withCredentials: true,
    });
  }
}
