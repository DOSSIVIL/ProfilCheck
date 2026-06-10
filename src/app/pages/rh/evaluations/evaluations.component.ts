import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { EvaluationSessionService } from '../../../core/services/evaluation-session.service';
import { SkillsGapPanelComponent } from './skills-gap-panel.component';
import { catchError, finalize, switchMap, tap, throwError, timeout } from 'rxjs';
import { TestService } from '../../../core/services/test.service';
import { ResultService } from '../../../core/services/result.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { EvaluationService } from '../../../core/services/evaluation.service';
import { HealthService } from '../../../core/services/health.service';
import {
  SkillTest,
  TestResult,
  EmployeeProfile,
  CvAnalysisResponse,
  EvaluationResult,
  TestDifficulty,
} from '../../../core/models/api.models';
import { extractApiError } from '../../../core/utils/api-error.util';

type Tab = 'tests' | 'results';
type Difficulty = TestDifficulty;
type LogType = 'info' | 'success' | 'error' | 'warning';
interface StatusLog {
  type: LogType;
  message: string;
  time: string;
}

@Component({
  selector: 'app-rh-evaluations',
  imports: [FormsModule, DatePipe, DecimalPipe, RouterLink, SkillsGapPanelComponent],
  template: `
    <div class="space-y-6">

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold dark:text-dark-text">Évaluations</h2>
          <p class="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
            Générez des tests personnalisés par IA à partir du CV de l'employé
          </p>
        </div>
        <button (click)="openCreateTest()" class="btn-primary inline-flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nouveau test
        </button>
      </div>

      <!-- Error banner -->
      @if (error()) {
        <div class="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          {{ error() }}
        </div>
      }

      <!-- Tabs -->
      <div class="flex gap-1 p-1 bg-gray-100 dark:bg-dark-surface rounded-xl w-fit">
        <button
          (click)="activeTab.set('tests')"
          [class]="activeTab() === 'tests'
            ? 'bg-white dark:bg-dark-bg shadow text-primary font-semibold'
            : 'text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text'"
          class="px-5 py-2 rounded-lg text-sm transition-all">
          Tests ({{ tests().length }})
        </button>
        <button
          (click)="activeTab.set('results')"
          [class]="activeTab() === 'results'
            ? 'bg-white dark:bg-dark-bg shadow text-primary font-semibold'
            : 'text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text'"
          class="px-5 py-2 rounded-lg text-sm transition-all">
          Résultats ({{ results().length }})
        </button>
      </div>

      <!-- Loading skeleton -->
      @if (loading()) {
        <div class="space-y-4">
          @for (i of [1,2,3]; track i) {
            <div class="card p-5 animate-pulse">
              <div class="h-4 bg-gray-200 dark:bg-dark-border rounded w-1/2 mb-3"></div>
              <div class="h-3 bg-gray-200 dark:bg-dark-border rounded w-1/3"></div>
            </div>
          }
        </div>

      <!-- Tab: Tests -->
      } @else if (activeTab() === 'tests') {
        @if (tests().length === 0) {
          <div class="card p-12 text-center">
            <div class="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold dark:text-dark-text mb-2">Aucun test créé</h3>
            <p class="text-sm text-gray-500 dark:text-dark-text-secondary mb-6 max-w-xs mx-auto">
              Générez un test IA — il apparaîtra ici en attente de passage
            </p>
            <button (click)="openCreateTest()" class="btn-primary inline-flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Créer un test IA
            </button>
          </div>
        } @else {
          <!-- File d'attente -->
          @if (pendingTests().length > 0) {
            <div class="mb-8">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <svg class="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold dark:text-dark-text">File d'attente</h3>
                  <p class="text-xs text-gray-500 dark:text-dark-text-secondary">{{ pendingTests().length }} test(s) prêt(s) à être passés</p>
                </div>
              </div>
              <div class="space-y-3">
                @for (test of pendingTests(); track test.id) {
                  <div class="card p-5 border-l-4 border-l-amber-400 hover:shadow-md transition-shadow">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div class="flex items-start gap-4 flex-1 min-w-0">
                        <div class="w-11 h-11 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                          <svg class="w-5 h-5 text-violet-600 dark:text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                          </svg>
                        </div>
                        <div class="min-w-0">
                          <div class="flex items-center gap-2 flex-wrap mb-1">
                            <h3 class="font-semibold dark:text-dark-text truncate">{{ test.title }}</h3>
                            <span class="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                              En attente
                            </span>
                          </div>
                          <p class="text-sm text-gray-500 dark:text-dark-text-secondary">
                            {{ test.profileName }}
                            <span class="mx-1.5 text-gray-300">·</span>
                            {{ test.questions.length }} questions
                            <span class="mx-1.5 text-gray-300">·</span>
                            Créé le {{ test.createdAt | date:'dd/MM/yyyy' }}
                          </p>
                        </div>
                      </div>
                      <a [routerLink]="['/rh/evaluations/conduire', test.id]"
                        class="btn-primary text-sm px-5 py-2.5 flex-shrink-0 inline-flex items-center justify-center gap-2">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"/>
                        </svg>
                        Passer le test
                      </a>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Tests terminés -->
          @if (completedTests().length > 0) {
            <div>
              <div class="flex items-center gap-2 mb-4">
                <div class="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold dark:text-dark-text">Tests terminés</h3>
                  <p class="text-xs text-gray-500 dark:text-dark-text-secondary">Consultez les résultats dans l'onglet Résultats</p>
                </div>
              </div>
              <div class="space-y-2">
                @for (test of completedTests(); track test.id) {
                  <div class="card p-4 opacity-75">
                    <div class="flex items-center justify-between gap-3">
                      <div class="min-w-0">
                        <p class="font-medium dark:text-dark-text truncate text-sm">{{ test.title }}</p>
                        <p class="text-xs text-gray-500">{{ test.profileName }} · {{ test.createdAt | date:'dd/MM/yyyy' }}</p>
                      </div>
                      <span class="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 font-medium flex-shrink-0">
                        Terminé
                      </span>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        }

      <!-- Tab: Résultats -->
      } @else {
        @if (results().length === 0) {
          <div class="card p-12 text-center">
            <div class="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-dark-border flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold dark:text-dark-text mb-2">Aucun résultat</h3>
            <p class="text-sm text-gray-500 dark:text-dark-text-secondary">
              Les résultats apparaîtront après soumission des tests
            </p>
          </div>
        } @else {
          <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-dark-border">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 dark:bg-dark-surface">
                <tr>
                  <th class="text-left py-3 px-4 font-medium text-gray-500 dark:text-dark-text-secondary">Employé</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-500 dark:text-dark-text-secondary">Test</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-500 dark:text-dark-text-secondary">Score</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-500 dark:text-dark-text-secondary">Conformité</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-500 dark:text-dark-text-secondary">Statut</th>
                  <th class="text-left py-3 px-4 font-medium text-gray-500 dark:text-dark-text-secondary">Date</th>
                  <th class="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-dark-border">
                @for (result of results(); track result.id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                    <td class="py-3 px-4 font-medium dark:text-dark-text">{{ result.profileName }}</td>
                    <td class="py-3 px-4 text-gray-600 dark:text-dark-text-secondary">{{ result.testTitle }}</td>
                    <td class="py-3 px-4">
                      <span [class]="scoreClass(result.score)" class="font-semibold">
                        {{ result.score | number:'1.0-1' }}%
                      </span>
                    </td>
                    <td class="py-3 px-4 text-gray-600 dark:text-dark-text-secondary">
                      {{ result.complianceScore | number:'1.0-1' }}%
                    </td>
                    <td class="py-3 px-4">
                      <span [class]="statusClass(result.status)"
                        class="text-xs px-2 py-0.5 rounded-full font-medium">
                        {{ result.status }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-gray-500 dark:text-dark-text-secondary">
                      {{ result.createdAt | date:'dd/MM/yyyy' }}
                    </td>
                    <td class="py-3 px-4">
                      <button (click)="viewResult(result)"
                        class="text-primary hover:underline text-sm font-medium">
                        Détails
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      }

      <!-- MODAL : Créer un test IA -->
      @if (showCreateModal()) {
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
             (click)="closeCreateModal()">
          <div class="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col"
               (click)="$event.stopPropagation()">

            <!-- Header -->
            <div class="p-6 border-b border-gray-200 dark:border-dark-border bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-2xl">
              <div class="flex items-start justify-between">
                <div>
                  <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                      <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-xl font-bold dark:text-dark-text">Générer un test IA</h3>
                      <p class="text-sm text-gray-500 dark:text-dark-text-secondary">CV → Analyse IA → Questions personnalisées</p>
                    </div>
                  </div>
                  <!-- Stepper -->
                  <div class="flex items-center gap-2 mt-4">
                    @for (step of pipelineSteps; track step.id; let i = $index) {
                      <div class="flex items-center gap-2">
                        <div [class]="getStepClass(step.id)"
                          class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all">
                          @if (currentPipelineStep() > step.id) { ✓ }
                          @else if (currentPipelineStep() === step.id && saving()) {
                            <svg class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                          } @else { {{ step.id }} }
                        </div>
                        <span class="text-xs font-medium hidden sm:inline" [class]="currentPipelineStep() >= step.id ? 'text-primary' : 'text-gray-400'">{{ step.label }}</span>
                        @if (i < pipelineSteps.length - 1) {
                          <div class="w-6 h-0.5 rounded" [class]="currentPipelineStep() > step.id ? 'bg-primary' : 'bg-gray-200 dark:bg-dark-border'"></div>
                        }
                      </div>
                    }
                  </div>
                </div>
                <button (click)="closeCreateModal()" [disabled]="saving()"
                  class="text-gray-400 hover:text-gray-600 dark:hover:text-dark-text transition-colors p-1 disabled:opacity-30">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex-1 overflow-y-auto p-6 space-y-5">

              @if (backendOnline() === false) {
                <div class="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
                  <div>
                    <p class="text-sm font-semibold text-red-600 dark:text-red-400">Backend inaccessible</p>
                    <p class="text-xs text-red-500/80 mt-1">Démarrez le serveur : <code class="bg-red-100 dark:bg-red-900/40 px-1 rounded">./run-dev.sh</code> dans le dossier Backend (port 8080)</p>
                  </div>
                </div>
              }

              @if (backendOnline() === true && aiConfigured() === false) {
                <div class="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <svg class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
                  <div>
                    <p class="text-sm font-semibold text-amber-700 dark:text-amber-300">Clé API IA non configurée</p>
                    <p class="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">
                      Ajoutez <code class="bg-amber-100 dark:bg-amber-900/40 px-1 rounded">OPENAI_API_KEY</code> dans <code class="bg-amber-100 dark:bg-amber-900/40 px-1 rounded">Backend/.env</code> puis redémarrez avec <code class="bg-amber-100 dark:bg-amber-900/40 px-1 rounded">./run-dev.sh</code>
                    </p>
                  </div>
                </div>
              }

              @if (employees().length === 0) {
                <div class="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-300">
                  Aucun employé trouvé. Créez d'abord un employé dans la section <strong>Employés</strong>.
                </div>
              }

              @if (formError()) {
                <div class="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
                  <p class="text-sm font-medium text-red-600 dark:text-red-400">{{ formError() }}</p>
                </div>
              }

              @if (formSuccess()) {
                <div class="flex items-start gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <p class="text-sm font-medium text-green-600 dark:text-green-400">{{ formSuccess() }}</p>
                </div>
              }

              <!-- Employé -->
              <div class="space-y-1.5">
                <label class="flex items-center gap-2 text-sm font-medium dark:text-dark-text">
                  <span class="inline-flex items-center justify-center w-5 h-5 rounded-full
                               bg-primary text-white text-xs font-bold flex-shrink-0">1</span>
                  Employé <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <select [(ngModel)]="testForm.profileId" name="profileId" required
                    class="w-full rounded-lg border border-gray-300 dark:border-dark-border
                           bg-white dark:bg-dark-bg px-4 py-2.5 pr-10 text-sm
                           focus:ring-2 focus:ring-primary focus:border-transparent
                           dark:text-dark-text appearance-none">
                    <option [ngValue]="0" disabled>Sélectionner un employé</option>
                    @for (emp of employees(); track emp.id) {
                      <option [ngValue]="emp.id">{{ emp.fullName }} — {{ emp.jobTitle }}</option>
                    }
                  </select>
                  <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                       fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <!-- Titre -->
              <div class="space-y-1.5">
                <label class="flex items-center gap-2 text-sm font-medium dark:text-dark-text">
                  <span class="inline-flex items-center justify-center w-5 h-5 rounded-full
                               bg-primary text-white text-xs font-bold flex-shrink-0">2</span>
                  Titre du test <span class="text-red-500">*</span>
                </label>
                <input type="text" [(ngModel)]="testForm.title" name="title" required
                  placeholder="Ex : Évaluation compétences React"
                  class="w-full rounded-lg border border-gray-300 dark:border-dark-border
                         bg-white dark:bg-dark-bg px-4 py-2.5 text-sm
                         focus:ring-2 focus:ring-primary focus:border-transparent dark:text-dark-text" />
              </div>

              <!-- CV -->
              <div class="space-y-1.5">
                <label class="flex items-center gap-2 text-sm font-medium dark:text-dark-text">
                  <span class="inline-flex items-center justify-center w-5 h-5 rounded-full
                               bg-primary text-white text-xs font-bold flex-shrink-0">3</span>
                  CV de l'employé <span class="text-red-500">*</span>
                </label>
                <div class="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all"
                     [class]="cvFileName()
                       ? 'border-green-400 bg-green-50 dark:bg-green-900/10'
                       : 'border-gray-300 dark:border-dark-border hover:border-primary hover:bg-primary/5'"
                     (click)="cvFileInput.click()">
                  <input type="file" #cvFileInput
                    (change)="onCVSelected($event)"
                    accept=".pdf,.doc,.docx,.txt"
                    class="hidden" />

                  @if (cvFileName()) {
                    <div class="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                      <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="text-sm font-medium truncate max-w-[220px]">{{ cvFileName() }}</span>
                      <span class="text-xs text-gray-400 flex-shrink-0">· cliquer pour changer</span>
                    </div>
                  } @else {
                    <div>
                      <svg class="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <p class="text-sm text-gray-600 dark:text-dark-text-secondary font-medium">
                        Cliquez pour importer le CV
                      </p>
                      <p class="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, TXT — max 10 MB</p>
                    </div>
                  }
                </div>
              </div>

              <!-- Paramètres -->
              <div class="space-y-3">
                <label class="flex items-center gap-2 text-sm font-medium dark:text-dark-text">
                  <span class="inline-flex items-center justify-center w-5 h-5 rounded-full
                               bg-primary text-white text-xs font-bold flex-shrink-0">4</span>
                  Paramètres de génération
                </label>

                <div class="grid grid-cols-2 gap-4">
                  <!-- Nombre de questions -->
                  <div class="p-4 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
                    <p class="text-xs text-gray-500 dark:text-dark-text-secondary font-medium uppercase tracking-wide mb-3">
                      Nb. de questions
                    </p>
                    <div class="flex items-center justify-between gap-2">
                      <button type="button"
                        (click)="testForm.questionCount = testForm.questionCount > 1 ? testForm.questionCount - 1 : 1"
                        class="w-8 h-8 rounded-full border border-gray-300 dark:border-dark-border
                               flex items-center justify-center text-gray-600 dark:text-dark-text
                               hover:bg-white dark:hover:bg-dark-surface hover:border-primary
                               transition-colors text-lg leading-none font-medium">
                        −
                      </button>
                      <span class="text-2xl font-bold text-primary tabular-nums">
                        {{ testForm.questionCount }}
                      </span>
                      <button type="button"
                        (click)="testForm.questionCount = testForm.questionCount < 20 ? testForm.questionCount + 1 : 20"
                        class="w-8 h-8 rounded-full border border-gray-300 dark:border-dark-border
                               flex items-center justify-center text-gray-600 dark:text-dark-text
                               hover:bg-white dark:hover:bg-dark-surface hover:border-primary
                               transition-colors text-lg leading-none font-medium">
                        +
                      </button>
                    </div>
                    <p class="text-xs text-gray-400 mt-2 text-center">1 – 20</p>
                  </div>

                  <!-- Difficulté -->
                  <div class="p-4 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
                    <p class="text-xs text-gray-500 dark:text-dark-text-secondary font-medium uppercase tracking-wide mb-3">
                      Difficulté
                    </p>
                    <div class="space-y-1.5">
                      @for (lvl of difficultyLevels; track lvl.value) {
                        <label class="flex items-center gap-2 cursor-pointer group">
                          <input type="radio"
                            [(ngModel)]="testForm.difficulty"
                            [value]="lvl.value"
                            name="difficulty"
                            class="accent-primary" />
                          <span [class]="lvl.color"
                            class="text-xs font-medium px-2 py-0.5 rounded-full">
                            {{ lvl.label }}
                          </span>
                        </label>
                      }
                    </div>
                  </div>
                </div>
              </div>

              @if (cvAnalysis()) {
                <div class="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                  <p class="text-xs font-bold uppercase tracking-wider text-primary mb-2">Profil extrait du CV</p>
                  <p class="text-sm text-gray-700 dark:text-dark-text-secondary mb-3">{{ cvAnalysis()!.summary || cvAnalysis()!.bio || 'Analyse terminée.' }}</p>
                  @if (cvAnalysis()!.coreSkills?.length) {
                    <div class="flex flex-wrap gap-1.5">
                      @for (skill of cvAnalysis()!.coreSkills; track skill) {
                        <span class="text-xs px-2.5 py-1 rounded-full bg-primary/15 text-primary font-medium">{{ skill }}</span>
                      }
                    </div>
                  }
                </div>
              }

              <!-- Journal de communication -->
              @if (statusLogs().length > 0) {
                <div class="rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
                  <div class="px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border flex items-center justify-between">
                    <p class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-dark-text-secondary">Journal de génération</p>
                    @if (saving()) {
                      <span class="text-xs text-primary animate-pulse">En cours…</span>
                    }
                  </div>
                  <div class="max-h-40 overflow-y-auto p-3 space-y-1.5 font-mono text-xs">
                    @for (log of statusLogs(); track $index) {
                      <div class="flex items-start gap-2" [class]="logClass(log.type)">
                        <span class="flex-shrink-0 font-bold w-4">{{ logIcon(log.type) }}</span>
                        <span class="text-gray-400 flex-shrink-0">{{ log.time }}</span>
                        <span class="flex-1">{{ log.message }}</span>
                      </div>
                    }
                  </div>
                </div>
              }

            </div>

            <!-- Footer actions -->
            <div class="p-6 border-t border-gray-200 dark:border-dark-border bg-gray-50/50 dark:bg-dark-bg/50 rounded-b-2xl flex gap-3">
              <button type="button" (click)="closeCreateModal()" [disabled]="saving()" class="btn-secondary flex-1 disabled:opacity-40">
                Annuler
              </button>
              <button type="button" (click)="createTest()" [disabled]="saving()"
                class="btn-primary flex-1 inline-flex items-center justify-center gap-2 disabled:opacity-70">
                @if (saving()) {
                  <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  {{ generationStep() || 'Traitement…' }}
                } @else {
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                  </svg>
                  Générer le test
                }
              </button>
            </div>
          </div>
        </div>
      }

      <!-- MODAL : Résultat après soumission -->
      @if (submitResult()) {
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
             (click)="closeSubmitResult()">
          <div class="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto"
               (click)="$event.stopPropagation()">
            <div class="p-6 border-b border-gray-200 dark:border-dark-border sticky top-0 bg-white dark:bg-dark-surface z-10">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <svg class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <h3 class="text-xl font-bold dark:text-dark-text">Évaluation terminée</h3>
                  </div>
                  <p class="text-sm text-gray-500 dark:text-dark-text-secondary">
                    {{ submitResult()!.profileName }} — {{ submitResult()!.testTitle }}
                  </p>
                </div>
                <button (click)="closeSubmitResult()" class="text-gray-400 hover:text-gray-600 p-1">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
            <div class="p-6 space-y-5">
              <div class="grid grid-cols-2 gap-4">
                <div class="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
                  <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Score ICG</p>
                  <p class="text-3xl font-bold text-primary">{{ submitResult()!.icgScore | number:'1.0-1' }}%</p>
                </div>
                <div class="p-4 rounded-xl bg-secondary/5 border border-secondary/10 text-center">
                  <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Conformité</p>
                  <p class="text-lg font-bold text-secondary">{{ submitResult()!.conformityLabel || '—' }}</p>
                </div>
              </div>
              @if (submitResult()!.rhDecisionLabel) {
                <div class="p-4 rounded-xl border text-sm text-center" [class]="decisionClass(submitResult()!.rhDecision)">
                  <p class="text-xs uppercase tracking-wide opacity-70 mb-1">Décision RH</p>
                  <p class="text-lg font-bold">{{ submitResult()!.rhDecisionLabel }}</p>
                </div>
              }

              <!-- Fonctionnalité distinctive : analyse des écarts -->
              <app-skills-gap-panel [resultId]="submitResult()!.id" />

              <div class="flex flex-col gap-3 pt-2">
                <button type="button" (click)="downloadReport(submitResult()!.id)"
                  [disabled]="downloadingReport()"
                  class="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50">
                  @if (downloadingReport()) {
                    <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Génération…
                  } @else {
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                    </svg>
                    Télécharger le rapport PDF
                  }
                </button>
                <button type="button" (click)="closeSubmitResult()" class="btn-secondary w-full">Fermer</button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- MODAL : Détail résultat -->
      @if (selectedResult()) {
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
             (click)="selectedResult.set(null)">
          <div class="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
               (click)="$event.stopPropagation()">

            <div class="p-6 border-b border-gray-200 dark:border-dark-border flex items-center justify-between">
              <h3 class="text-lg font-semibold dark:text-dark-text">Résultat de l'évaluation</h3>
              <button (click)="selectedResult.set(null)"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-dark-text transition-colors p-1">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="p-6 space-y-5">
              <div class="grid grid-cols-2 gap-4">
                <div class="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
                  <p class="text-xs text-gray-500 dark:text-dark-text-secondary uppercase tracking-wide mb-1">ICG</p>
                  <p class="text-3xl font-bold text-primary">
                    {{ (selectedResult()!.icgScore ?? selectedResult()!.score) | number:'1.0-1' }}%
                  </p>
                </div>
                <div class="p-4 rounded-xl bg-secondary/5 border border-secondary/10 text-center">
                  <p class="text-xs text-gray-500 dark:text-dark-text-secondary uppercase tracking-wide mb-1">Conformité</p>
                  <p class="text-3xl font-bold text-secondary">
                    {{ selectedResult()!.conformityLabel || (selectedResult()!.complianceScore | number:'1.0-1') + '%' }}
                  </p>
                </div>
              </div>

              @if (selectedResult()!.rhDecisionLabel) {
                <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm">
                  <span class="font-medium text-amber-800 dark:text-amber-300">Décision RH :</span>
                  {{ selectedResult()!.rhDecisionLabel }}
                </div>
              }

              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <div>
                    <p class="text-xs text-gray-500 dark:text-dark-text-secondary">Employé</p>
                    <p class="text-sm font-medium dark:text-dark-text">{{ selectedResult()!.profileName }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                  </svg>
                  <div>
                    <p class="text-xs text-gray-500 dark:text-dark-text-secondary">Test</p>
                    <p class="text-sm font-medium dark:text-dark-text">{{ selectedResult()!.testTitle }}</p>
                  </div>
                </div>
              </div>

              @if (hasQuestionScores(selectedResult()!)) {
                <div class="space-y-3">
                  <p class="text-sm font-medium dark:text-dark-text">Détail par question</p>
                  @for (qs of getQuestionScores(selectedResult()!); track qs.questionId) {
                    <div class="p-3 rounded-xl border border-gray-200 dark:border-dark-border text-sm">
                      <p class="font-medium dark:text-dark-text mb-1">{{ qs.questionText }}</p>
                      <p class="text-xs text-gray-500 mb-1">Score : {{ (qs.score * 100) | number:'1.0-0' }}%</p>
                      <p class="text-xs text-gray-600 dark:text-dark-text-secondary">{{ qs.feedback }}</p>
                    </div>
                  }
                </div>
              }

              @if (selectedResult()!.aiFeedback) {
                <div class="p-4 rounded-xl bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border">
                  <div class="flex items-center gap-2 mb-2">
                    <svg class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    <p class="text-sm font-medium dark:text-dark-text">Synthèse IA</p>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-dark-text-secondary whitespace-pre-wrap leading-relaxed">
                    {{ selectedResult()!.aiFeedback }}
                  </p>
                </div>
              }

              @if (selectedResult()!.id) {
                <button type="button" (click)="downloadReport(selectedResult()!.id)"
                  [disabled]="downloadingReport()"
                  class="btn-secondary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                  </svg>
                  Télécharger le rapport PDF
                </button>
              }

              <button (click)="selectedResult.set(null)" class="btn-primary w-full">
                Fermer
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `,
})
export class RhEvaluationsComponent implements OnInit {
  private readonly testService = inject(TestService);
  private readonly resultService = inject(ResultService);
  private readonly employeeService = inject(EmployeeService);
  private readonly evaluationService = inject(EvaluationService);
  private readonly healthService = inject(HealthService);
  private readonly sessionService = inject(EvaluationSessionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly activeTab = signal<Tab>('tests');
  protected readonly tests = signal<SkillTest[]>([]);
  protected readonly results = signal<TestResult[]>([]);
  protected readonly employees = signal<EmployeeProfile[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly showCreateModal = signal(false);
  protected readonly selectedResult = signal<EvaluationResult | TestResult | null>(null);
  protected readonly saving = signal(false);
  protected readonly formError = signal('');
  protected readonly formSuccess = signal('');
  protected readonly cvFileName = signal('');
  protected readonly generationStep = signal('');
  protected readonly cvAnalysis = signal<CvAnalysisResponse | null>(null);
  protected readonly statusLogs = signal<StatusLog[]>([]);
  protected readonly backendOnline = signal<boolean | null>(null);
  protected readonly aiConfigured = signal<boolean | null>(null);
  protected readonly currentPipelineStep = signal(0);
  protected readonly submitResult = signal<EvaluationResult | null>(null);
  protected readonly downloadingReport = signal(false);

  protected readonly pipelineSteps = [
    { id: 1, label: 'Validation' },
    { id: 2, label: 'Analyse CV' },
    { id: 3, label: 'Génération IA' },
    { id: 4, label: 'Terminé' },
  ];

  testForm = {
    profileId: 0,
    title: '',
    questionCount: 5,
    difficulty: 'MOYEN' as Difficulty,
  };

  cvFile: File | null = null;

  protected readonly pendingTests = computed(() =>
    this.tests().filter((t) => t.status === 'ACTIVE')
  );
  protected readonly completedTests = computed(() =>
    this.tests().filter((t) => t.status === 'COMPLETED')
  );

  readonly difficultyLevels: { value: Difficulty; label: string; color: string }[] = [
    { value: 'FACILE',    label: 'Facile',   color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
    { value: 'MOYEN',     label: 'Moyen',    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
    { value: 'DIFFICILE', label: 'Difficile',color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
    { value: 'MIXTE',     label: 'Mixte',    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  ];

  ngOnInit(): void {
    this.loadAll();
    this.loadEmployees();
    this.checkPendingResult();
  }

  private checkPendingResult(): void {
    const fromSession = this.sessionService.consumePendingResult();
    if (fromSession) {
      this.submitResult.set(fromSession);
      this.activeTab.set('results');
      this.loadAll();
      this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
    }
  }

  private loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (data: EmployeeProfile[]) => this.employees.set(data),
      error: (err: any) => this.error.set(extractApiError(err)),
    });
  }

  private loadAll(): void {
    this.loading.set(true);
    let pending = 2;
    const done = () => { if (--pending === 0) this.loading.set(false); };

    this.loadTests(done);
    this.resultService.getAll().subscribe({
      next: (data: TestResult[]) => { this.results.set(data); done(); },
      error: (err: any) => { this.error.set(extractApiError(err)); done(); },
    });
  }

  private loadTests(onDone?: () => void): void {
    this.testService.getAll().subscribe({
      next: (data: SkillTest[]) => { this.tests.set(data); onDone?.(); },
      error: (err: any) => { this.error.set(extractApiError(err)); onDone?.(); },
    });
  }

  openCreateTest(): void {
    this.testForm = { profileId: 0, title: '', questionCount: 5, difficulty: 'MOYEN' };
    this.cvFile = null;
    this.cvFileName.set('');
    this.cvAnalysis.set(null);
    this.generationStep.set('');
    this.formError.set('');
    this.formSuccess.set('');
    this.statusLogs.set([]);
    this.currentPipelineStep.set(0);
    this.backendOnline.set(null);
    this.aiConfigured.set(null);
    this.showCreateModal.set(true);
    this.healthService.getStatus().subscribe((status) => {
      this.backendOnline.set(status.online);
      this.aiConfigured.set(status.aiConfigured);
    });
  }

  closeCreateModal(): void {
    if (this.saving()) return;
    this.showCreateModal.set(false);
    this.cvFile = null;
    this.cvFileName.set('');
    this.cvAnalysis.set(null);
    this.generationStep.set('');
    this.formSuccess.set('');
    this.statusLogs.set([]);
    this.currentPipelineStep.set(0);
  }

  private addLog(type: LogType, message: string): void {
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.statusLogs.update((logs) => [...logs, { type, message, time }]);
  }

  logIcon(type: LogType): string {
    return { info: '→', success: '✓', error: '✗', warning: '!' }[type];
  }

  logClass(type: LogType): string {
    return {
      info: 'text-gray-600 dark:text-dark-text-secondary',
      success: 'text-green-600 dark:text-green-400',
      error: 'text-red-600 dark:text-red-400',
      warning: 'text-amber-600 dark:text-amber-400',
    }[type];
  }

  getStepClass(stepId: number): string {
    if (this.currentPipelineStep() > stepId) return 'bg-primary text-white';
    if (this.currentPipelineStep() === stepId) return 'bg-primary/20 text-primary ring-2 ring-primary';
    return 'bg-gray-100 dark:bg-dark-border text-gray-400';
  }

  onCVSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const allowed = ['.pdf', '.txt', '.doc', '.docx'];
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!allowed.includes(ext)) {
      this.formError.set('Format non supporté. Utilisez PDF ou TXT de préférence.');
      input.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this.formError.set('Le fichier ne doit pas dépasser 10 MB');
      input.value = '';
      return;
    }

    this.cvFile = file;
    this.cvFileName.set(file.name);
    this.cvAnalysis.set(null);
    this.formError.set('');
    input.value = '';
  }

  getProfileId(): number {
    return Number(this.testForm.profileId) || 0;
  }

  isFormValid(): boolean {
    return (
      this.getProfileId() > 0 &&
      this.testForm.title.trim().length > 0 &&
      this.cvFile !== null &&
      this.testForm.questionCount >= 1 &&
      this.testForm.questionCount <= 20
    );
  }

  getMissingFieldsHint(): string {
    const missing: string[] = [];
    if (this.getProfileId() <= 0) missing.push('employé');
    if (!this.testForm.title.trim()) missing.push('titre');
    if (!this.cvFile) missing.push('CV');
    return missing.length
      ? `Champs manquants : ${missing.join(', ')}.`
      : '';
  }

  createTest(): void {
    this.formError.set('');
    this.formSuccess.set('');
    this.statusLogs.set([]);
    this.currentPipelineStep.set(1);
    this.addLog('info', 'Démarrage de la génération du test…');

    if (this.backendOnline() === false) {
      this.addLog('error', 'Backend inaccessible sur http://localhost:8080');
      this.formError.set('Le serveur backend n\'est pas démarré. Lancez ./run-dev.sh dans le dossier Backend.');
      this.currentPipelineStep.set(0);
      return;
    }

    if (!this.isFormValid() || !this.cvFile) {
      const hint = this.getMissingFieldsHint();
      this.addLog('error', hint || 'Formulaire incomplet');
      this.formError.set(hint || 'Veuillez remplir tous les champs obligatoires avant de générer.');
      this.currentPipelineStep.set(0);
      return;
    }

    const profileId = this.getProfileId();
    const cvFile = this.cvFile;
    const employee = this.employees().find((e) => e.id === profileId);

    this.addLog('success', `Formulaire validé — Employé: ${employee?.fullName ?? profileId}, ${this.testForm.questionCount} questions, niveau ${this.getDifficultyLabel()}`);
    this.saving.set(true);
    this.cvAnalysis.set(null);
    this.currentPipelineStep.set(2);
    this.generationStep.set('Analyse du CV…');
    this.addLog('info', `Envoi du CV "${cvFile.name}" (${(cvFile.size / 1024).toFixed(0)} Ko) au serveur…`);

    this.employeeService.uploadCv(profileId, cvFile).pipe(
      timeout(120_000),
      tap((analysis) => {
        this.cvAnalysis.set(analysis);
        this.currentPipelineStep.set(3);
        this.generationStep.set('Génération des questions IA…');
        this.addLog('success', `CV analysé — ${analysis.coreSkills?.length ?? 0} compétence(s) clé(s) détectée(s)`);
        if (analysis.summary) this.addLog('info', `Résumé IA : ${analysis.summary.substring(0, 120)}${analysis.summary.length > 120 ? '…' : ''}`);
        this.addLog('info', `Demande de génération de ${this.testForm.questionCount} questions au serveur…`);
      }),
      catchError((err) => {
        const msg = extractApiError(err);
        this.addLog('error', `Échec analyse CV : ${msg}`);
        this.formError.set(`Erreur analyse CV : ${msg}`);
        this.currentPipelineStep.set(0);
        return throwError(() => err);
      }),
      switchMap(() =>
        this.evaluationService.start({
          profileId,
          title: this.testForm.title.trim(),
          questionCount: this.testForm.questionCount,
          difficulty: this.testForm.difficulty,
        }).pipe(
          timeout(180_000),
          catchError((err) => {
            const msg = extractApiError(err);
            this.addLog('error', `Échec génération IA : ${msg}`);
            this.formError.set(`Erreur génération : ${msg}`);
            this.currentPipelineStep.set(0);
            return throwError(() => err);
          })
        )
      ),
      finalize(() => {
        this.saving.set(false);
        this.generationStep.set('');
      })
    ).subscribe({
      next: (test) => {
        if (!test.questions?.length) {
          this.addLog('error', 'Aucune question générée par l\'IA');
          this.formError.set('Aucune question générée. Vérifiez la clé API OpenAI dans Backend/.env');
          this.currentPipelineStep.set(0);
          return;
        }
        this.currentPipelineStep.set(4);
        this.addLog('success', `Test créé avec ${test.questions.length} question(s) — ajouté à la file d'attente`);
        this.formSuccess.set(`Test "${test.title}" prêt ! Retrouvez-le dans la file d'attente.`);
        this.loadTests();
        this.activeTab.set('tests');
        setTimeout(() => this.closeCreateModal(), 1800);
      },
      error: () => {
        this.currentPipelineStep.set(0);
      },
    });
  }

  decisionClass(decision?: string): string {
    const map: Record<string, string> = {
      VALIDATION_AUTOMATIQUE: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300',
      REVISION_MANUELLE: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300',
      ENTRETIEN_OBLIGATOIRE: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300',
    };
    return map[decision ?? ''] ?? 'bg-gray-50 dark:bg-dark-bg border-gray-200 dark:border-dark-border';
  }

  closeSubmitResult(): void {
    this.submitResult.set(null);
  }

  downloadReport(resultId: number): void {
    this.downloadingReport.set(true);
    this.evaluationService.downloadReport(resultId).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `rapport-evaluation-${resultId}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
        this.downloadingReport.set(false);
      },
      error: (err: any) => {
        this.formError.set(extractApiError(err));
        this.downloadingReport.set(false);
      },
    });
  }

  viewResult(result: TestResult): void {
    this.selectedResult.set(result);
  }

  hasQuestionScores(result: EvaluationResult | TestResult): result is EvaluationResult {
    return 'questionScores' in result && Array.isArray((result as EvaluationResult).questionScores);
  }

  getQuestionScores(result: EvaluationResult | TestResult) {
    return this.hasQuestionScores(result) ? result.questionScores : [];
  }

  getEmployeeName(): string {
    const emp = this.employees().find(e => e.id === this.testForm.profileId);
    return emp ? emp.fullName : '—';
  }

  getDifficultyLabel(): string {
    return this.difficultyLevels.find(l => l.value === this.testForm.difficulty)?.label ?? this.testForm.difficulty;
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      DRAFT:       'bg-gray-100 text-gray-600 dark:bg-dark-border dark:text-dark-text-secondary',
      ACTIVE:      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      COMPLETED:   'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      ARCHIVED:    'bg-gray-100 text-gray-500',
      PENDING:     'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      IN_PROGRESS: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    };
    return map[status] ?? 'bg-gray-100 text-gray-600';
  }

  scoreClass(score: number): string {
    if (score >= 80) return 'text-success';
    if (score >= 50) return 'text-accent';
    return 'text-danger';
  }
}