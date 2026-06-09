import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { DashboardStats } from '../../../core/models/api.models';
import { extractApiError } from '../../../core/utils/api-error.util';

@Component({
  selector: 'app-rh-dashboard',
  imports: [RouterLink, DatePipe],
  template: `
    <div class="space-y-6">
      <!-- Welcome banner -->
      <div class="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold">
              Bonjour, {{ auth.currentUser()?.fullName?.split(' ')?.[0] ?? 'RH' }}
            </h2>
            <p class="text-white/80 mt-1">
              Bienvenue sur votre espace de gestion des compétences
            </p>
          </div>
          <a routerLink="/rh/employees" 
             class="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nouvel employé
          </a>
        </div>
      </div>

      <!-- Error message -->
      @if (error()) {
        <div class="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
          {{ error() }}
        </div>
      }

      <!-- Stats cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Employees -->
        <div class="bg-white dark:bg-dark-surface rounded-xl p-5 shadow-sm border border-gray-100 dark:border-dark-border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-dark-text-secondary">Employés</p>
              @if (loading()) {
                <div class="mt-2 h-8 w-16 bg-gray-200 dark:bg-dark-border rounded animate-pulse"></div>
              } @else {
                <p class="text-3xl font-bold mt-1 dark:text-dark-text">{{ stats()?.totalProfiles || 0 }}</p>
              }
            </div>
            <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.21a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Active Tests -->
        <div class="bg-white dark:bg-dark-surface rounded-xl p-5 shadow-sm border border-gray-100 dark:border-dark-border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-dark-text-secondary">Tests actifs</p>
              @if (loading()) {
                <div class="mt-2 h-8 w-16 bg-gray-200 dark:bg-dark-border rounded animate-pulse"></div>
              } @else {
                <p class="text-3xl font-bold mt-1 dark:text-dark-text">{{ stats()?.activeTests || 0 }}</p>
              }
            </div>
            <div class="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Completed Results -->
        <div class="bg-white dark:bg-dark-surface rounded-xl p-5 shadow-sm border border-gray-100 dark:border-dark-border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-dark-text-secondary">Résultats</p>
              @if (loading()) {
                <div class="mt-2 h-8 w-16 bg-gray-200 dark:bg-dark-border rounded animate-pulse"></div>
              } @else {
                <p class="text-3xl font-bold mt-1 dark:text-dark-text">{{ stats()?.completedResults || 0 }}</p>
              }
            </div>
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Compliance Score -->
        <div class="bg-white dark:bg-dark-surface rounded-xl p-5 shadow-sm border border-gray-100 dark:border-dark-border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-dark-text-secondary">Score conformité</p>
              @if (loading()) {
                <div class="mt-2 h-8 w-16 bg-gray-200 dark:bg-dark-border rounded animate-pulse"></div>
              } @else {
                <p class="text-3xl font-bold mt-1 dark:text-dark-text">{{ getComplianceScore() }}%</p>
              }
            </div>
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Quick Actions -->
        <div class="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border border-gray-100 dark:border-dark-border">
          <h3 class="text-lg font-semibold mb-4 dark:text-dark-text">Actions rapides</h3>
          <div class="space-y-3">
            <a routerLink="/rh/employees" 
               class="flex items-center gap-4 p-3 rounded-xl border border-gray-200 dark:border-dark-border hover:border-primary/50 hover:bg-primary/5 transition-all">
              <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <div>
                <p class="font-medium dark:text-dark-text">Gérer les employés</p>
                <p class="text-sm text-gray-500 dark:text-dark-text-secondary">Ajouter et modifier les profils</p>
              </div>
            </a>

            <a routerLink="/rh/evaluations" 
               class="flex items-center gap-4 p-3 rounded-xl border border-gray-200 dark:border-dark-border hover:border-secondary/50 hover:bg-secondary/5 transition-all">
              <div class="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                </svg>
              </div>
              <div>
                <p class="font-medium dark:text-dark-text">Gérer les évaluations</p>
                <p class="text-sm text-gray-500 dark:text-dark-text-secondary">Créer et suivre les tests</p>
              </div>
            </a>

            <a routerLink="/rh/profile" 
               class="flex items-center gap-4 p-3 rounded-xl border border-gray-200 dark:border-dark-border hover:border-accent/50 hover:bg-accent/5 transition-all">
              <div class="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div>
                <p class="font-medium dark:text-dark-text">Mon profil</p>
                <p class="text-sm text-gray-500 dark:text-dark-text-secondary">Modifier vos informations</p>
              </div>
            </a>
          </div>
        </div>

        <!-- Company Information -->
        <div class="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border border-gray-100 dark:border-dark-border">
          <h3 class="text-lg font-semibold mb-4 dark:text-dark-text">Entreprise</h3>
          @if (auth.currentUser(); as user) {
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold">
                  {{ user.company.name.charAt(0) }}
                </div>
                <div>
                  <p class="font-semibold text-lg dark:text-dark-text">{{ user.company.name }}</p>
                  <p class="text-sm text-gray-500 dark:text-dark-text-secondary">Code: {{ user.company.code }}</p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-dark-border">
                <div>
                  <p class="text-xs text-gray-500 dark:text-dark-text-secondary uppercase">Rôle</p>
                  <p class="font-medium dark:text-dark-text">{{ user.role }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-dark-text-secondary uppercase">Membre depuis</p>
                  <p class="font-medium dark:text-dark-text">{{ user.createdAt | date:'dd/MM/yyyy' }}</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class RhDashboardComponent implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);

  protected loading = signal(true);
  protected error = signal('');
  protected stats = signal<DashboardStats | null>(null);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractApiError(err));
        this.loading.set(false);
      },
    });
  }

  getComplianceScore(): string {
    const score = this.stats()?.averageComplianceScore;
    if (score !== undefined && score !== null) {
      return score.toFixed(1);
    }
    return '0';
  }
}