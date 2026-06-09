import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../models/api.models';

export function extractApiError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as ApiError | string;
    if (typeof body === 'string') return body;
    if (body?.details?.length) return body.details.join('. ');
    if (body?.message) return body.message;
    return `Erreur ${error.status}: ${error.statusText}`;
  }
  return 'Une erreur inattendue est survenue';
}
