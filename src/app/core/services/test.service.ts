import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  SkillTest,
  TestGenerateRequest,
  TestSubmitRequest,
  TestResult,
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class TestService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/tests`;

  getAll(): Observable<SkillTest[]> {
    return this.http.get<SkillTest[]>(this.baseUrl);
  }

  getByProfile(profileId: number): Observable<SkillTest[]> {
    return this.http.get<SkillTest[]>(`${this.baseUrl}/profile/${profileId}`);
  }

  getById(id: number): Observable<SkillTest> {
    return this.http.get<SkillTest>(`${this.baseUrl}/${id}`);
  }

  generate(data: TestGenerateRequest): Observable<SkillTest> {
    return this.http.post<SkillTest>(this.baseUrl, data);
  }

  submit(data: TestSubmitRequest): Observable<TestResult> {
    return this.http.post<TestResult>(`${this.baseUrl}/submit`, data);
  }
}
