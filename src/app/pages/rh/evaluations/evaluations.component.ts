import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TestService } from '../../../core/services/test.service';
import { ResultService } from '../../../core/services/result.service';
import { EmployeeService } from '../../../core/services/employee.service';
import {
  SkillTest,
  TestResult,
  EmployeeProfile,
  TestQuestion,
} from '../../../core/models/api.models';
import { extractApiError } from '../../../core/utils/api-error.util';

type Tab = 'tests' | 'results';
type Difficulty = 'FACILE' | 'MOYEN' | 'DIFFICILE' | 'MIXTE';

@Component({
  selector: 'app-rh-evaluations',
  imports: [FormsModule, DatePipe, DecimalPipe],
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
              Importez un CV et laissez l'IA générer les questions pour vous
            </p>
            <button (click)="openCreateTest()" class="btn-primary inline-flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Créer un test IA
            </button>
          </div>
        } @else {
          <div class="space-y-3">
            @for (test of tests(); track test.id) {
              <div class="card p-5 hover:shadow-md transition-shadow">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 class="font-semibold dark:text-dark-text truncate">{{ test.title }}</h3>
                      <span [class]="statusClass(test.status)"
                        class="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                        {{ test.status }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-500 dark:text-dark-text-secondary">
                      {{ test.profileName }}
                      <span class="mx-1.5 text-gray-300">·</span>
                      {{ test.questions.length }} question{{ test.questions.length > 1 ? 's' : '' }}
                      <span class="mx-1.5 text-gray-300">·</span>
                      {{ test.createdAt | date:'dd/MM/yyyy' }}
                    </p>
                  </div>
                  <button (click)="viewTest(test)"
                    class="btn-secondary text-sm px-4 py-2 flex-shrink-0 inline-flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    Répondre
                  </button>
                </div>
              </div>
            }
          </div>
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
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
             (click)="closeCreateModal()">
          <div class="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl w-full max-w-lg"
               (click)="$event.stopPropagation()">

            <div class="p-6 border-b border-gray-200 dark:border-dark-border flex items-start justify-between">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <div class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold dark:text-dark-text">Créer un test IA</h3>
                </div>
                <p class="text-sm text-gray-500 dark:text-dark-text-secondary">
                  L'IA génère les questions à partir du CV
                </p>
              </div>
              <button (click)="closeCreateModal()"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-dark-text transition-colors p-1">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form class="p-6 space-y-5 max-h-[70vh] overflow-y-auto" (ngSubmit)="createTest()">

              @if (formError()) {
                <div class="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20
                            text-red-600 dark:text-red-400 text-sm">
                  <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  {{ formError() }}
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
                      <p class="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, TXT — max 5 MB</p>
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

              <!-- Actions -->
              <div class="flex gap-3 pt-2">
                <button type="button" (click)="closeCreateModal()" class="btn-secondary flex-1">
                  Annuler
                </button>
                <button type="submit"
                  [disabled]="saving() || !isFormValid()"
                  class="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed
                         inline-flex items-center justify-center gap-2">
                  @if (saving()) {
                    <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Génération en cours…
                  } @else {
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    Générer le test
                  }
                </button>
              </div>

            </form>
          </div>
        </div>
      }

      <!-- MODAL : Répondre au test -->
      @if (selectedTest()) {
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
             (click)="selectedTest.set(null)">
          <div class="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
               (click)="$event.stopPropagation()">

            <div class="p-6 border-b border-gray-200 dark:border-dark-border flex-shrink-0">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="text-lg font-semibold dark:text-dark-text">{{ selectedTest()!.title }}</h3>
                  <p class="text-sm text-gray-500 dark:text-dark-text-secondary mt-0.5">
                    {{ selectedTest()!.profileName }}
                    <span class="mx-1.5 text-gray-300">·</span>
                    {{ selectedTest()!.questions.length }} question{{ selectedTest()!.questions.length > 1 ? 's' : '' }}
                  </p>
                </div>
                <button (click)="selectedTest.set(null)"
                  class="text-gray-400 hover:text-gray-600 dark:hover:text-dark-text transition-colors p-1">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form class="flex-1 overflow-y-auto p-6 space-y-4" (ngSubmit)="submitTest()">

              @if (formError()) {
                <div class="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20
                            text-red-600 dark:text-red-400 text-sm">
                  <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  {{ formError() }}
                </div>
              }

              @if (submitSuccess()) {
                <div class="flex items-start gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20
                            text-green-600 dark:text-green-400 text-sm">
                  <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ submitSuccess() }}
                </div>
              }

              @for (q of selectedTest()!.questions; track q.id; let i = $index) {
                <div class="p-4 rounded-xl border border-gray-200 dark:border-dark-border
                            hover:border-primary/40 transition-colors">
                  <div class="flex items-start justify-between gap-3 mb-3">
                    <p class="text-sm font-medium dark:text-dark-text leading-relaxed">
                      <span class="text-primary font-semibold mr-1.5">Q{{ i + 1 }}.</span>
                      {{ q.questionText }}
                    </p>
                    <!-- Version corrigée - affichage simple sans difficulté -->
                    <span class="text-xs px-2 py-0.5 rounded-full flex-shrink-0 bg-gray-100 text-gray-600 dark:bg-dark-border dark:text-dark-text-secondary">
                      Question {{ i + 1 }}
                    </span>
                  </div>
                  <textarea
                    [(ngModel)]="answers[q.id!]"
                    [name]="'answer_' + q.id"
                    rows="3"
                    placeholder="Votre réponse…"
                    class="w-full rounded-lg border border-gray-300 dark:border-dark-border
                           bg-white dark:bg-dark-bg px-4 py-2.5 text-sm
                           focus:ring-2 focus:ring-primary focus:border-transparent
                           dark:text-dark-text resize-none transition-colors">
                  </textarea>
                </div>
              }

              <div class="flex gap-3 pt-2 sticky bottom-0 bg-white dark:bg-dark-surface pb-1">
                <button type="button" (click)="selectedTest.set(null)" class="btn-secondary flex-1">
                  Fermer
                </button>
                <button type="submit"
                  [disabled]="saving()"
                  class="btn-primary flex-1 disabled:opacity-50 inline-flex items-center justify-center gap-2">
                  @if (saving()) {
                    <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Soumission…
                  } @else {
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                    Soumettre les réponses
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- MODAL : Détail résultat -->
      @if (selectedResult()) {
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
             (click)="selectedResult.set(null)">
          <div class="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl w-full max-w-md"
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
                  <p class="text-xs text-gray-500 dark:text-dark-text-secondary uppercase tracking-wide mb-1">Score</p>
                  <p class="text-3xl font-bold text-primary">
                    {{ selectedResult()!.score | number:'1.0-1' }}%
                  </p>
                </div>
                <div class="p-4 rounded-xl bg-secondary/5 border border-secondary/10 text-center">
                  <p class="text-xs text-gray-500 dark:text-dark-text-secondary uppercase tracking-wide mb-1">Conformité</p>
                  <p class="text-3xl font-bold text-secondary">
                    {{ selectedResult()!.complianceScore | number:'1.0-1' }}%
                  </p>
                </div>
              </div>

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

              @if (selectedResult()!.aiFeedback) {
                <div class="p-4 rounded-xl bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border">
                  <div class="flex items-center gap-2 mb-2">
                    <svg class="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    <p class="text-sm font-medium dark:text-dark-text">Feedback IA</p>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-dark-text-secondary whitespace-pre-wrap leading-relaxed">
                    {{ selectedResult()!.aiFeedback }}
                  </p>
                </div>
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
  private readonly testService   = inject(TestService);
  private readonly resultService = inject(ResultService);
  private readonly employeeService = inject(EmployeeService);

  protected readonly activeTab      = signal<Tab>('tests');
  protected readonly tests          = signal<SkillTest[]>([]);
  protected readonly results        = signal<TestResult[]>([]);
  protected readonly employees      = signal<EmployeeProfile[]>([]);
  protected readonly loading        = signal(true);
  protected readonly error          = signal('');
  protected readonly showCreateModal = signal(false);
  protected readonly selectedTest   = signal<SkillTest | null>(null);
  protected readonly selectedResult = signal<TestResult | null>(null);
  protected readonly saving         = signal(false);
  protected readonly formError      = signal('');
  protected readonly submitSuccess  = signal('');
  protected readonly cvFileName     = signal('');

  testForm = {
    profileId: 0,
    title: '',
    questionCount: 5,
    difficulty: 'MOYEN' as Difficulty,
  };

  cvFile: File | null = null;
  answers: Record<number, string> = {};

  readonly difficultyLevels: { value: Difficulty; label: string; color: string }[] = [
    { value: 'FACILE',    label: 'Facile',   color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
    { value: 'MOYEN',     label: 'Moyen',    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
    { value: 'DIFFICILE', label: 'Difficile',color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
    { value: 'MIXTE',     label: 'Mixte',    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  ];

  ngOnInit(): void {
    this.loadAll();
    this.loadEmployees();
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
    this.formError.set('');
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
    this.cvFile = null;
    this.cvFileName.set('');
  }

  onCVSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        this.formError.set('Le fichier ne doit pas dépasser 5 MB');
        return;
      }
      this.cvFile = file;
      this.cvFileName.set(file.name);
      this.formError.set('');
    }
  }

  isFormValid(): boolean {
    return (
      this.testForm.profileId > 0 &&
      this.testForm.title.trim().length > 0 &&
      this.cvFile !== null &&
      this.testForm.questionCount >= 1 &&
      this.testForm.questionCount <= 20
    );
  }

  createTest(): void {
    if (!this.isFormValid()) {
      this.formError.set('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.saving.set(true);
    this.formError.set('');

    // Version corrigée - sans questionCount ni difficulty
    this.testService.generate({
      profileId: this.testForm.profileId,
      title: this.testForm.title.trim(),
      description: `Généré par IA — ${this.testForm.questionCount} questions — niveau ${this.testForm.difficulty}`,
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeCreateModal();
        this.loadTests();
      },
      error: (err: any) => {
        this.formError.set(extractApiError(err));
        this.saving.set(false);
      },
    });
  }

  viewTest(test: SkillTest): void {
    this.answers = {};
    test.questions.forEach((q: TestQuestion) => {
      if (q.id) this.answers[q.id] = '';
    });
    this.formError.set('');
    this.submitSuccess.set('');
    this.selectedTest.set(test);
  }

  submitTest(): void {
    const test = this.selectedTest();
    if (!test) return;

    const answerList = test.questions
      .filter((q: TestQuestion) => q.id)
      .map((q: TestQuestion) => ({ questionId: q.id!, answer: this.answers[q.id!] || '' }));

    if (answerList.every((a: { answer: string }) => !a.answer.trim())) {
      this.formError.set('Veuillez répondre à au moins une question');
      return;
    }

    this.saving.set(true);
    this.formError.set('');

    this.testService.submit({ testId: test.id, answers: answerList }).subscribe({
      next: (result: TestResult) => {
        this.saving.set(false);
        this.submitSuccess.set(
          `Test soumis ! Score : ${result.score.toFixed(1)}% — Conformité : ${result.complianceScore.toFixed(1)}%`
        );
        this.loadAll();
        setTimeout(() => this.submitSuccess.set(''), 4000);
      },
      error: (err: any) => {
        this.formError.set(extractApiError(err));
        this.saving.set(false);
      },
    });
  }

  viewResult(result: TestResult): void {
    this.selectedResult.set(result);
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