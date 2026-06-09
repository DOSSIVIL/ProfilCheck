import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TestResult } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ResultService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/results`;

  getAll(): Observable<TestResult[]> {
    return this.http.get<TestResult[]>(this.baseUrl);
  }

  getByProfile(profileId: number): Observable<TestResult[]> {
    return this.http.get<TestResult[]>(`${this.baseUrl}/profile/${profileId}`);
  }

  getById(id: number): Observable<TestResult> {
    return this.http.get<TestResult>(`${this.baseUrl}/${id}`);
  }
}
