import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EmployeeProfile, ProfileRequest } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/profiles`;

  getAll(): Observable<EmployeeProfile[]> {
    return this.http.get<EmployeeProfile[]>(this.baseUrl);
  }

  getById(id: number): Observable<EmployeeProfile> {
    return this.http.get<EmployeeProfile>(`${this.baseUrl}/${id}`);
  }

  create(data: ProfileRequest): Observable<EmployeeProfile> {
    return this.http.post<EmployeeProfile>(this.baseUrl, data);
  }

  update(id: number, data: ProfileRequest): Observable<EmployeeProfile> {
    return this.http.put<EmployeeProfile>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
