import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { DashboardData } from '../features/dashboard/dashboard.model';
import { AnalyticsData } from '../features/dashboard/analytics.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/admin/dashboard`;

  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(this.apiUrl);

    
  }

  getAnalytics(): Observable<AnalyticsData> {
  return this.http.get<AnalyticsData>(
    `${this.apiUrl}/analytics`
  );
}
}