import { Component, inject, OnInit, signal, computed, OnDestroy } from '@angular/core';
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
      <!-- Welcome banner with date and time -->
      <div class="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <div class="text-4xl">{{ getGreetingIcon() }}</div>
              <div>
                <h2 class="text-2xl font-bold">
                  {{ getGreeting() }}, {{ auth.currentUser()?.fullName?.split(' ')?.[0] ?? 'RH' }}
                </h2>
                <p class="text-white/80 mt-1">
                  Bienvenue sur votre espace de gestion des compétences
                </p>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-4 mt-3 text-white/80 text-sm">
              <div class="flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ currentDate() | date:'EEEE d MMMM yyyy' }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ currentTime() }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 17v4" />
                </svg>
                <span>{{ getWeekNumber() }}e semaine</span>
              </div>
            </div>
          </div>
          <a routerLink="/rh/employees" 
             class="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nouvel employé
          </a>
        </div>
      </div>

      <!-- Error message -->
      @if (error()) {
        <div class="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm animate-shake">
          {{ error() }}
        </div>
      }

      <!-- Stats cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Employees -->
        <div class="bg-white dark:bg-dark-surface rounded-xl p-5 shadow-sm border border-gray-100 dark:border-dark-border hover:shadow-md transition-all duration-200 group">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-dark-text-secondary">Employés</p>
              @if (loading()) {
                <div class="mt-2 h-8 w-16 bg-gray-200 dark:bg-dark-border rounded animate-pulse"></div>
              } @else {
                <p class="text-3xl font-bold mt-1 dark:text-dark-text">{{ stats()?.totalProfiles || 0 }}</p>
              }
            </div>
            <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.21a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Active Tests -->
        <div class="bg-white dark:bg-dark-surface rounded-xl p-5 shadow-sm border border-gray-100 dark:border-dark-border hover:shadow-md transition-all duration-200 group">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-dark-text-secondary">Tests actifs</p>
              @if (loading()) {
                <div class="mt-2 h-8 w-16 bg-gray-200 dark:bg-dark-border rounded animate-pulse"></div>
              } @else {
                <p class="text-3xl font-bold mt-1 dark:text-dark-text">{{ stats()?.activeTests || 0 }}</p>
              }
            </div>
            <div class="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Completed Results -->
        <div class="bg-white dark:bg-dark-surface rounded-xl p-5 shadow-sm border border-gray-100 dark:border-dark-border hover:shadow-md transition-all duration-200 group">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-dark-text-secondary">Résultats</p>
              @if (loading()) {
                <div class="mt-2 h-8 w-16 bg-gray-200 dark:bg-dark-border rounded animate-pulse"></div>
              } @else {
                <p class="text-3xl font-bold mt-1 dark:text-dark-text">{{ stats()?.completedResults || 0 }}</p>
              }
            </div>
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Compliance Score -->
        <div class="bg-white dark:bg-dark-surface rounded-xl p-5 shadow-sm border border-gray-100 dark:border-dark-border hover:shadow-md transition-all duration-200 group">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 dark:text-dark-text-secondary">Score conformité</p>
              @if (loading()) {
                <div class="mt-2 h-8 w-16 bg-gray-200 dark:bg-dark-border rounded animate-pulse"></div>
              } @else {
                <p class="text-3xl font-bold mt-1 dark:text-dark-text">{{ getComplianceScore() }}%</p>
              }
            </div>
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Two columns layout for Calendar and Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Calendar Section -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
            <div class="p-6 border-b border-gray-200 dark:border-dark-border">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold dark:text-dark-text">Calendrier</h3>
                  <p class="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">Événements et deadlines à venir</p>
                </div>
                <div class="flex gap-2">
                  <button (click)="previousMonth()" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button (click)="nextMonth()" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div class="p-6">
              <!-- Month and Year -->
              <div class="text-center mb-6">
                <h4 class="text-xl font-semibold dark:text-dark-text">
                  {{ getMonthName(calendarMonth()) }} {{ calendarYear() }}
                </h4>
              </div>
              
              <!-- Week days -->
              <div class="grid grid-cols-7 gap-1 mb-2">
                @for (day of weekDays; track day) {
                  <div class="text-center text-xs font-medium text-gray-500 dark:text-dark-text-secondary py-2">
                    {{ day }}
                  </div>
                }
              </div>
              
              <!-- Calendar days -->
              <div class="grid grid-cols-7 gap-1">
                @for (day of calendarDays(); track $index) {
                  <div 
                    (click)="selectDate(day.date)"
                    [class]="getDayClasses(day)"
                    class="min-h-[80px] p-2 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md">
                    <div class="flex justify-between items-start">
                      <span class="text-sm font-medium" [class]="!day.isCurrentMonth ? 'text-gray-400' : 'dark:text-dark-text'">
                        {{ day.dayNumber }}
                      </span>
                      @if (day.hasEvents) {
                        <div class="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      }
                    </div>
                    @if (day.isToday) {
                      <div class="mt-1">
                        <span class="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">Aujourd'hui</span>
                      </div>
                    }
                    @if (day.events && day.events.length > 0) {
                      <div class="mt-1 space-y-0.5">
                        @for (event of day.events.slice(0, 2); track event.id) {
                          <div class="text-xs truncate" [class]="getEventColor(event.type)">
                            {{ event.title }}
                          </div>
                        }
                        @if (day.events.length > 2) {
                          <div class="text-xs text-gray-400">+{{ day.events.length - 2 }}</div>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions and Stats -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <div class="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border border-gray-100 dark:border-dark-border">
            <div class="flex items-center gap-2 mb-4">
              <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 class="text-lg font-semibold dark:text-dark-text">Actions rapides</h3>
            </div>
            <div class="space-y-3">
              <a routerLink="/rh/employees" 
                 class="flex items-center gap-4 p-3 rounded-xl border border-gray-200 dark:border-dark-border hover:border-primary/50 hover:bg-primary/5 transition-all group">
                <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
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
                 class="flex items-center gap-4 p-3 rounded-xl border border-gray-200 dark:border-dark-border hover:border-secondary/50 hover:bg-secondary/5 transition-all group">
                <div class="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
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
                 class="flex items-center gap-4 p-3 rounded-xl border border-gray-200 dark:border-dark-border hover:border-accent/50 hover:bg-accent/5 transition-all group">
                <div class="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
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
            <div class="flex items-center gap-2 mb-4">
              <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 class="text-lg font-semibold dark:text-dark-text">Entreprise</h3>
            </div>
            @if (auth.currentUser(); as user) {
              <div class="space-y-4">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold shadow-md">
                    {{ user.company.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-semibold text-lg dark:text-dark-text">{{ user.company.name }}</p>
                    <p class="text-sm text-gray-500 dark:text-dark-text-secondary">Code: {{ user.company.code }}</p>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-dark-border">
                  <div>
                    <p class="text-xs text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Rôle</p>
                    <p class="font-medium dark:text-dark-text mt-1">{{ user.role }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Membre depuis</p>
                    <p class="font-medium dark:text-dark-text mt-1">{{ user.createdAt | date:'dd/MM/yyyy' }}</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    .animate-shake {
      animation: shake 0.3s ease-in-out;
    }
  `]
})
export class RhDashboardComponent implements OnInit, OnDestroy {
  protected readonly auth = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);

  protected loading = signal(true);
  protected error = signal('');
  protected stats = signal<DashboardStats | null>(null);
  
  // Date and time
  protected currentDate = signal(new Date());
  protected currentTime = signal('');
  private timeInterval: any;

  // Calendar properties
  protected calendarYear = signal(new Date().getFullYear());
  protected calendarMonth = signal(new Date().getMonth()); // 5 = juin (0-indexed)
  protected selectedDate = signal(new Date());
  protected weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  
  // Mock events for calendar - CORRECTED to current month (June 2024)
  protected calendarEvents = signal([
    { 
      id: 1, 
      title: 'Évaluation technique', 
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 15), 
      type: 'evaluation' 
    },
    { 
      id: 2, 
      title: 'Entretien annuel', 
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 20), 
      type: 'meeting' 
    },
    { 
      id: 3, 
      title: 'Deadline rapport', 
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 25), 
      type: 'deadline' 
    },
    { 
      id: 4, 
      title: 'Formation compliance', 
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 5), 
      type: 'training' 
    },
    { 
      id: 5, 
      title: 'Revue de performance', 
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 28), 
      type: 'meeting' 
    }
  ]);

  ngOnInit(): void {
    this.loadDashboardData();
    this.updateCurrentTime();
    this.timeInterval = setInterval(() => this.updateCurrentTime(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
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

  // Greeting methods
  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }

  getGreetingIcon(): string {
    const hour = new Date().getHours();
    if (hour < 12) return '☀️';
    if (hour < 18) return '🌤️';
    return '🌙';
  }

  private updateCurrentTime(): void {
    const now = new Date();
    this.currentDate.set(now);
    this.currentTime.set(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
  }

  getWeekNumber(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    return Math.ceil((diff / 86400000 + start.getDay() + 1) / 7);
  }

  getMonthName(month: number): string {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return months[month];
  }

  // Calendar methods
  calendarDays = computed(() => {
    const year = this.calendarYear();
    const month = this.calendarMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    let startDay = firstDayOfMonth.getDay();
    // Convert Sunday (0) to 7, and shift to make Monday first
    startDay = startDay === 0 ? 7 : startDay;
    const daysInMonth = lastDayOfMonth.getDate();
    
    const days: any[] = [];
    const today = new Date();
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i > 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i + 1);
      days.push({
        date,
        dayNumber: date.getDate(),
        isCurrentMonth: false,
        isToday: false,
        hasEvents: this.hasEventsOnDate(date),
        events: this.getEventsOnDate(date)
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        dayNumber: i,
        isCurrentMonth: true,
        isToday: this.isSameDay(date, today),
        hasEvents: this.hasEventsOnDate(date),
        events: this.getEventsOnDate(date)
      });
    }
    
    // Next month days (to complete the grid)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        dayNumber: date.getDate(),
        isCurrentMonth: false,
        isToday: false,
        hasEvents: this.hasEventsOnDate(date),
        events: this.getEventsOnDate(date)
      });
    }
    
    return days;
  });

  previousMonth(): void {
    if (this.calendarMonth() === 0) {
      this.calendarYear.set(this.calendarYear() - 1);
      this.calendarMonth.set(11);
    } else {
      this.calendarMonth.set(this.calendarMonth() - 1);
    }
  }

  nextMonth(): void {
    if (this.calendarMonth() === 11) {
      this.calendarYear.set(this.calendarYear() + 1);
      this.calendarMonth.set(0);
    } else {
      this.calendarMonth.set(this.calendarMonth() + 1);
    }
  }

  selectDate(date: Date): void {
    this.selectedDate.set(date);
    // You can add additional logic here, like showing a modal with events for that day
    console.log('Date sélectionnée:', date);
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  private hasEventsOnDate(date: Date): boolean {
    return this.calendarEvents().some(event => this.isSameDay(event.date, date));
  }

  private getEventsOnDate(date: Date): any[] {
    return this.calendarEvents().filter(event => this.isSameDay(event.date, date));
  }

  getDayClasses(day: any): string {
    const classes = ['bg-white dark:bg-dark-surface'];
    if (!day.isCurrentMonth) {
      classes.push('bg-gray-50 dark:bg-dark-bg text-gray-400 dark:text-dark-text-secondary');
    }
    if (day.isToday) {
      classes.push('border-primary bg-primary/5 dark:bg-primary/10 ring-1 ring-primary/50');
    }
    if (this.isSameDay(day.date, this.selectedDate())) {
      classes.push('ring-2 ring-primary shadow-md');
    }
    if (!day.isToday && !this.isSameDay(day.date, this.selectedDate())) {
      classes.push('border-gray-200 dark:border-dark-border hover:border-primary/30');
    }
    return classes.join(' ');
  }

  getEventColor(type: string): string {
    switch(type) {
      case 'evaluation': return 'text-blue-600 dark:text-blue-400';
      case 'meeting': return 'text-green-600 dark:text-green-400';
      case 'deadline': return 'text-red-600 dark:text-red-400';
      case 'training': return 'text-purple-600 dark:text-purple-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  }
}