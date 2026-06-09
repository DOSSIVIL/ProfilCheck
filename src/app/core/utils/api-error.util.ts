import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../models/api.models';

export function extractApiError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return 'Serveur inaccessible. Démarrez le backend sur http://localhost:8080';
    }
    const body = error.error;
    if (typeof body === 'string' && body.length) return body;
    if (body && typeof body === 'object') {
      const apiError = body as ApiError;
      if (apiError.details?.length) return apiError.details.join('. ');
      if (apiError.message) return apiError.message;
    }
    return `Erreur ${error.status}: ${error.statusText}`;
  }
  if (error && typeof error === 'object' && 'name' in error && (error as { name: string }).name === 'TimeoutError') {
    return 'Délai dépassé. L\'analyse IA prend trop de temps, réessayez.';
  }
  return 'Une erreur inattendue est survenue';
}
