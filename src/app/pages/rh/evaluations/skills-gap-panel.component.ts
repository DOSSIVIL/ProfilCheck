import { Component, input, signal, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { EvaluationService } from '../../../core/services/evaluation.service';
import { SkillsGapAnalysis } from '../../../core/models/api.models';

@Component({
  selector: 'app-skills-gap-panel',
  imports: [DecimalPipe],
  template: `
    @if (loading()) {
      <div class="p-6 rounded-xl border border-gray-200 dark:border-dark-border animate-pulse space-y-3">
        <div class="h-4 bg-gray-200 dark:bg-dark-border rounded w-1/3"></div>
        <div class="h-24 bg-gray-100 dark:bg-dark-bg rounded"></div>
      </div>
    } @else if (analysis()) {
      <div class="rounded-xl border border-violet-200 dark:border-violet-800/50 overflow-hidden">
        <div class="px-5 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            <div>
              <h4 class="font-bold text-sm">Analyse des écarts de compétences</h4>
              <p class="text-xs text-white/80">Fonctionnalité exclusive ProfilCheck — guide décisionnel RH</p>
            </div>
          </div>
        </div>

        <div class="p-5 space-y-5 bg-white dark:bg-dark-surface">
          <!-- Barres par catégorie -->
          <div class="space-y-3">
            @for (cat of analysis()!.categories; track cat.category) {
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="font-medium dark:text-dark-text">{{ cat.label }}</span>
                  <span [class]="statusTextClass(cat.status)" class="font-semibold">
                    {{ cat.statusLabel }} — {{ cat.averageScore * 100 | number:'1.0-0' }}%
                  </span>
                </div>
                <div class="h-2.5 rounded-full bg-gray-100 dark:bg-dark-border overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-700"
                    [class]="statusBarClass(cat.status)"
                    [style.width.%]="cat.averageScore * 100">
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Forces / Faiblesses -->
          <div class="grid sm:grid-cols-2 gap-3">
            @if (analysis()!.strengths.length) {
              <div class="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p class="text-xs font-bold text-green-700 dark:text-green-300 uppercase mb-2">Forces</p>
                <ul class="space-y-1">
                  @for (s of analysis()!.strengths; track s) {
                    <li class="text-xs text-green-800 dark:text-green-200 flex gap-1.5">
                      <span>✓</span><span>{{ s }}</span>
                    </li>
                  }
                </ul>
              </div>
            }
            @if (analysis()!.weaknesses.length) {
              <div class="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <p class="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase mb-2">À approfondir</p>
                <ul class="space-y-1">
                  @for (w of analysis()!.weaknesses; track w) {
                    <li class="text-xs text-amber-800 dark:text-amber-200 flex gap-1.5">
                      <span>!</span><span>{{ w }}</span>
                    </li>
                  }
                </ul>
              </div>
            }
          </div>

          <!-- Guide d'entretien -->
          <div>
            <p class="text-sm font-semibold dark:text-dark-text mb-3 flex items-center gap-2">
              <svg class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              Guide d'entretien complémentaire
            </p>
            <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
              @for (q of analysis()!.interviewGuide; track $index) {
                <div class="p-3 rounded-lg border border-gray-200 dark:border-dark-border text-sm">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs font-bold text-primary">{{ q.topic }}</span>
                    <span [class]="priorityClass(q.priority)"
                      class="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
                      {{ q.priority }}
                    </span>
                  </div>
                  <p class="text-gray-700 dark:text-dark-text-secondary text-xs leading-relaxed">{{ q.question }}</p>
                </div>
              }
            </div>
          </div>

          <div class="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
            <p class="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase mb-1">Recommandation RH</p>
            <p class="text-sm text-indigo-900 dark:text-indigo-100">{{ analysis()!.hiringRecommendation }}</p>
          </div>
        </div>
      </div>
    }
  `,
})
export class SkillsGapPanelComponent implements OnInit {
  private readonly evaluationService = inject(EvaluationService);

  readonly resultId = input.required<number>();

  protected readonly loading = signal(true);
  protected readonly analysis = signal<SkillsGapAnalysis | null>(null);

  ngOnInit(): void {
    this.load(this.resultId());
  }

  private load(id: number): void {
    this.loading.set(true);
    this.evaluationService.getSkillsGap(id).subscribe({
      next: (data) => {
        this.analysis.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  statusBarClass(status: string): string {
    const map: Record<string, string> = {
      STRONG: 'bg-green-500',
      ADEQUATE: 'bg-cyan-500',
      WEAK: 'bg-amber-500',
      CRITICAL: 'bg-red-500',
    };
    return map[status] ?? 'bg-gray-400';
  }

  statusTextClass(status: string): string {
    const map: Record<string, string> = {
      STRONG: 'text-green-600 dark:text-green-400',
      ADEQUATE: 'text-cyan-600 dark:text-cyan-400',
      WEAK: 'text-amber-600 dark:text-amber-400',
      CRITICAL: 'text-red-600 dark:text-red-400',
    };
    return map[status] ?? 'text-gray-500';
  }

  priorityClass(priority: string): string {
    const map: Record<string, string> = {
      HAUTE: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
      MOYENNE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
      BASSE: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    };
    return map[priority] ?? 'bg-gray-100 text-gray-600';
  }
}
