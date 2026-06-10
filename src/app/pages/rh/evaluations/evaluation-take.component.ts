import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EvaluationService } from '../../../core/services/evaluation.service';
import { EvaluationSessionService } from '../../../core/services/evaluation-session.service';
import { TestService } from '../../../core/services/test.service';
import { SkillTest, TestQuestion } from '../../../core/models/api.models';
import { extractApiError } from '../../../core/utils/api-error.util';

@Component({
  selector: 'app-evaluation-take',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto space-y-6 pb-24">

      <!-- Fil d'Ariane -->
      <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-dark-text-secondary">
        <a routerLink="/rh/evaluations" class="hover:text-primary transition-colors">Évaluations</a>
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        <span class="text-gray-900 dark:text-dark-text font-medium">Session de passage</span>
      </nav>

      @if (loading()) {
        <div class="card p-12 text-center animate-pulse">
          <div class="h-6 bg-gray-200 dark:bg-dark-border rounded w-1/2 mx-auto mb-4"></div>
          <div class="h-4 bg-gray-100 dark:bg-dark-bg rounded w-1/3 mx-auto"></div>
        </div>
      } @else if (error()) {
        <div class="card p-8 text-center">
          <p class="text-red-600 dark:text-red-400 mb-4">{{ error() }}</p>
          <a routerLink="/rh/evaluations" class="btn-primary inline-flex">Retour aux évaluations</a>
        </div>
      } @else if (test()) {
        <!-- En-tête session -->
        <div class="card overflow-hidden">
          <div class="bg-gradient-to-r from-primary to-secondary px-6 py-5 text-white">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p class="text-xs uppercase tracking-widest text-white/70 mb-1">Session RH — conduite du test</p>
                <h1 class="text-xl font-bold">{{ test()!.title }}</h1>
                <p class="text-sm text-white/80 mt-1">{{ test()!.profileName }}</p>
              </div>
              <div class="text-right">
                <p class="text-3xl font-bold">{{ answeredCount() }}/{{ test()!.questions.length }}</p>
                <p class="text-xs text-white/70">réponses saisies</p>
              </div>
            </div>
            <div class="mt-4 h-2 rounded-full bg-white/20 overflow-hidden">
              <div class="h-full bg-white rounded-full transition-all duration-500"
                [style.width.%]="progressPercent()"></div>
            </div>
          </div>
          <div class="px-6 py-3 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 flex items-start gap-2 text-sm text-amber-800 dark:text-amber-200">
            <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <span>La <strong>bonne réponse est en vert</strong>. Cliquez sur la réponse donnée par l'employé pendant l'entretien oral.</span>
          </div>
        </div>

        @if (formError()) {
          <div class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
            {{ formError() }}
          </div>
        }

        <form (ngSubmit)="submit()" class="space-y-4">
          @for (q of test()!.questions; track q.id; let i = $index) {
            <div class="card p-5" [id]="'question-' + (i + 1)">
              <div class="flex items-start justify-between gap-3 mb-4">
                <div class="flex items-start gap-3">
                  <span class="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                    {{ i + 1 }}
                  </span>
                  <p class="text-sm font-medium dark:text-dark-text leading-relaxed pt-1">{{ q.questionText }}</p>
                </div>
                @if (q.weightCategory) {
                  <span [class]="weightClass(q.weightCategory)"
                    class="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium">
                    {{ weightLabel(q.weightCategory) }}
                  </span>
                }
              </div>

              @if (hasMcq(q)) {
                <div class="space-y-2 ml-11">
                  @for (opt of q.options!; track $index; let optIdx = $index) {
                    <button type="button"
                      (click)="selectOption(q.id!, optIdx)"
                      [class]="optionClass(q, optIdx)"
                      class="w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-start gap-3">
                      <span class="flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold"
                        [class]="optionBadgeClass(q, optIdx)">
                        {{ optionLetter(optIdx) }}
                      </span>
                      <span class="flex-1 dark:text-dark-text">{{ opt }}</span>
                      @if (optIdx === q.correctOptionIndex) {
                        <span class="text-xs font-semibold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full flex-shrink-0">
                          ✓ Référence
                        </span>
                      }
                    </button>
                  }
                </div>
              }
            </div>
          }
        </form>

        <!-- Barre d'action fixe -->
        <div class="fixed bottom-0 left-0 right-0 lg:left-64 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-md border-t border-gray-200 dark:border-dark-border px-4 sm:px-8 py-4 z-20">
          <div class="max-w-4xl mx-auto flex gap-3">
            <a routerLink="/rh/evaluations" class="btn-secondary flex-1 sm:flex-none sm:px-8 text-center">
              Annuler
            </a>
            <button type="button" (click)="submit()" [disabled]="saving()"
              class="btn-primary flex-1 inline-flex items-center justify-center gap-2 disabled:opacity-50">
              @if (saving()) {
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Calcul du score…
              } @else {
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Terminer et calculer le score
              }
            </button>
          </div>
        </div>
      }
    </div>
  `,
})
export class EvaluationTakeComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly testService = inject(TestService);
  private readonly evaluationService = inject(EvaluationService);
  private readonly sessionService = inject(EvaluationSessionService);

  protected readonly test = signal<SkillTest | null>(null);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal('');
  protected readonly formError = signal('');

  selectedOptions: Record<number, number> = {};

  protected readonly answeredCount = computed(() => {
    const t = this.test();
    if (!t) return 0;
    return t.questions.filter((q) => q.id && this.selectedOptions[q.id] !== undefined).length;
  });

  protected readonly progressPercent = computed(() => {
    const t = this.test();
    if (!t || t.questions.length === 0) return 0;
    return (this.answeredCount() / t.questions.length) * 100;
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('testId'));
    if (!id) {
      this.error.set('Test introuvable');
      this.loading.set(false);
      return;
    }
    this.testService.getById(id).subscribe({
      next: (test) => {
        if (test.status === 'COMPLETED') {
          this.error.set('Ce test a déjà été passé.');
          this.loading.set(false);
          return;
        }
        this.test.set(test);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractApiError(err));
        this.loading.set(false);
      },
    });
  }

  optionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  hasMcq(q: TestQuestion): boolean {
    return Array.isArray(q.options) && q.options.length >= 2;
  }

  selectOption(questionId: number, optionIndex: number): void {
    this.selectedOptions[questionId] = optionIndex;
  }

  optionClass(q: TestQuestion, optIdx: number): string {
    const isCorrect = optIdx === q.correctOptionIndex;
    const isSelected = q.id != null && this.selectedOptions[q.id] === optIdx;
    if (isCorrect) {
      return isSelected
        ? 'border-green-500 bg-green-100 dark:bg-green-900/30 ring-2 ring-green-400'
        : 'border-green-300 bg-green-50 dark:bg-green-900/10';
    }
    if (isSelected) {
      return 'border-red-400 bg-red-50 dark:bg-red-900/20 ring-2 ring-red-300';
    }
    return 'border-gray-200 dark:border-dark-border hover:border-primary/40 bg-white dark:bg-dark-bg';
  }

  optionBadgeClass(q: TestQuestion, optIdx: number): string {
    const isCorrect = optIdx === q.correctOptionIndex;
    const isSelected = q.id != null && this.selectedOptions[q.id] === optIdx;
    if (isCorrect) return 'border-green-500 text-green-700 bg-green-100';
    if (isSelected) return 'border-red-400 text-red-700 bg-red-100';
    return 'border-gray-300 text-gray-500';
  }

  weightLabel(category: string): string {
    const labels: Record<string, string> = {
      CORE_SKILL: 'Compétence clé',
      COMPLEMENTARY_SKILL: 'Complémentaire',
      TECHNICAL_SOFT_SKILL: 'Soft skill',
      GENERAL_CONTEXT: 'Contexte',
    };
    return labels[category] ?? category;
  }

  weightClass(category: string): string {
    const classes: Record<string, string> = {
      CORE_SKILL: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
      COMPLEMENTARY_SKILL: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
      TECHNICAL_SOFT_SKILL: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      GENERAL_CONTEXT: 'bg-gray-100 text-gray-600 dark:bg-dark-border dark:text-dark-text-secondary',
    };
    return classes[category] ?? classes['GENERAL_CONTEXT'];
  }

  submit(): void {
    const test = this.test();
    if (!test) return;

    const unanswered = test.questions.filter(
      (q) => q.id && this.hasMcq(q) && this.selectedOptions[q.id] === undefined
    );
    if (unanswered.length > 0) {
      this.formError.set(`Il reste ${unanswered.length} question(s) sans réponse.`);
      return;
    }

    const answerList = test.questions
      .filter((q) => q.id)
      .map((q) => ({
        questionId: q.id!,
        selectedOptionIndex: this.selectedOptions[q.id!],
        answer: q.options![this.selectedOptions[q.id!]],
      }));

    this.saving.set(true);
    this.formError.set('');

    this.evaluationService.submit({ testId: test.id, answers: answerList }).subscribe({
      next: (result) => {
        this.sessionService.setPendingResult(result);
        this.router.navigate(['/rh/evaluations'], { queryParams: { result: result.id } });
      },
      error: (err) => {
        this.formError.set(extractApiError(err));
        this.saving.set(false);
      },
    });
  }
}
