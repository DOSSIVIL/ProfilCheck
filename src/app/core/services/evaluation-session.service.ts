import { Injectable, signal } from '@angular/core';
import { EvaluationResult } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class EvaluationSessionService {
  private readonly _pendingResult = signal<EvaluationResult | null>(null);

  readonly pendingResult = this._pendingResult.asReadonly();

  setPendingResult(result: EvaluationResult): void {
    this._pendingResult.set(result);
  }

  consumePendingResult(): EvaluationResult | null {
    const result = this._pendingResult();
    this._pendingResult.set(null);
    return result;
  }
}
