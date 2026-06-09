import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  EvaluationResult,
  EvaluationStartRequest,
  SkillTest,
  TestSubmitRequest,
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class EvaluationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/evaluations`;

  start(data: EvaluationStartRequest): Observable<SkillTest> {
    return this.http.post<SkillTest>(`${this.baseUrl}/start`, data);
  }

  submit(data: TestSubmitRequest): Observable<EvaluationResult> {
    return this.http.post<EvaluationResult>(`${this.baseUrl}/submit`, data).pipe(
      map((result) => ({
        ...result,
        score: result.icgScore,
        complianceScore: result.icgScore,
      }))
    );
  }

  downloadReport(resultId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/results/${resultId}/report`, {
      responseType: 'blob',
    });
  }
}
