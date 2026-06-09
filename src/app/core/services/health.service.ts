import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface HealthStatus {
  online: boolean;
  aiConfigured: boolean;
  aiProvider?: string;
}

@Injectable({ providedIn: 'root' })
export class HealthService {
  private readonly http = inject(HttpClient);

  check(): Observable<boolean> {
    return this.getStatus().pipe(map((res) => res.online));
  }

  getStatus(): Observable<HealthStatus> {
    return this.http.get<{ status: string; aiConfigured?: boolean; aiProvider?: string }>(
      `${environment.apiUrl}/health`
    ).pipe(
      map((res) => ({
        online: res.status === 'UP',
        aiConfigured: res.aiConfigured ?? false,
        aiProvider: res.aiProvider,
      })),
      catchError(() => of({ online: false, aiConfigured: false }))
    );
  }
}
