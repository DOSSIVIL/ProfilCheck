import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { extractApiError } from '../../../core/utils/api-error.util';

@Component({
  selector: 'app-rh-profile',
  imports: [FormsModule, DatePipe],
  template: `
    <div class="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 class="text-2xl font-bold dark:text-dark-text">Mon profil</h2>
        <p class="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">Gérez vos informations personnelles et votre mot de passe</p>
      </div>

      @if (success()) {
        <div class="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm">
          {{ success() }}
        </div>
      }
      @if (error()) {
        <div class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {{ error() }}
        </div>
      }

      <!-- Info card -->
      @if (auth.currentUser(); as user) {
        <div class="card p-6 hover:translate-y-0">
          <div class="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-dark-border">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
              {{ user.fullName.charAt(0).toUpperCase() }}
            </div>
            <div>
              <h3 class="text-xl font-semibold dark:text-dark-text">{{ user.fullName }}</h3>
              <p class="text-sm text-gray-500 dark:text-dark-text-secondary">{{ user.email }}</p>
              <span class="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{{ user.role }}</span>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-dark-bg">
              <p class="text-xs text-gray-500 dark:text-dark-text-secondary uppercase tracking-wide">Entreprise</p>
              <p class="font-medium mt-1 dark:text-dark-text">{{ user.company.name }}</p>
            </div>
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-dark-bg">
              <p class="text-xs text-gray-500 dark:text-dark-text-secondary uppercase tracking-wide">Code entreprise</p>
              <p class="font-medium mt-1 dark:text-dark-text font-mono">{{ user.company.code }}</p>
            </div>
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-dark-bg">
              <p class="text-xs text-gray-500 dark:text-dark-text-secondary uppercase tracking-wide">Membre depuis</p>
              <p class="font-medium mt-1 dark:text-dark-text">{{ user.createdAt | date:'dd MMMM yyyy' }}</p>
            </div>
          </div>
        </div>
      }

      <!-- Edit form -->
      <div class="card p-6 hover:translate-y-0">
        <h3 class="text-lg font-semibold mb-4 dark:text-dark-text">Modifier mes informations</h3>
        <form class="space-y-5" (ngSubmit)="saveProfile()">
          <div>
            <label class="block text-sm font-medium mb-1.5 dark:text-dark-text">Nom complet</label>
            <input
              type="text"
              [(ngModel)]="fullName"
              name="fullName"
              class="w-full rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-dark-text"
            />
          </div>

          <div class="border-t border-gray-200 dark:border-dark-border pt-5">
            <h4 class="text-sm font-medium mb-3 dark:text-dark-text">Changer le mot de passe (optionnel)</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-1.5 dark:text-dark-text">Nouveau mot de passe</label>
                <input
                  type="password"
                  [(ngModel)]="newPassword"
                  name="newPassword"
                  class="w-full rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-dark-text"
                  placeholder="8 caractères, 1 majuscule, 1 chiffre"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5 dark:text-dark-text">Confirmer le mot de passe</label>
                <input
                  type="password"
                  [(ngModel)]="confirmPassword"
                  name="confirmPassword"
                  class="w-full rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-dark-text"
                />
                @if (newPassword && confirmPassword && newPassword !== confirmPassword) {
                  <p class="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas</p>
                }
              </div>
            </div>
          </div>

          <button type="submit" [disabled]="saving()" class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
            @if (saving()) {
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Enregistrement...
            } @else {
              Enregistrer les modifications
            }
          </button>
        </form>
      </div>
    </div>
  `,
})
export class RhProfileComponent implements OnInit {
  protected readonly auth = inject(AuthService);

  fullName = '';
  newPassword = '';
  confirmPassword = '';
  protected readonly saving = signal(false);
  protected readonly success = signal('');
  protected readonly error = signal('');

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (user) {
      this.fullName = user.fullName;
    }
  }

  saveProfile(): void {
    this.success.set('');
    this.error.set('');

    if (!this.fullName.trim()) {
      this.error.set('Le nom complet est requis');
      return;
    }

    if (this.newPassword) {
      if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[a-z]).{8,}$/.test(this.newPassword)) {
        this.error.set('Le mot de passe doit contenir 8 caractères, 1 majuscule, 1 minuscule et 1 chiffre');
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        this.error.set('Les mots de passe ne correspondent pas');
        return;
      }
    }

    this.saving.set(true);
    const payload: { fullName: string; password?: string } = { fullName: this.fullName.trim() };
    if (this.newPassword) payload.password = this.newPassword;

    this.auth.updateProfile(payload).subscribe({
      next: () => {
        this.success.set('Profil mis à jour avec succès');
        this.newPassword = '';
        this.confirmPassword = '';
        this.saving.set(false);
      },
      error: (err) => {
        this.error.set(extractApiError(err));
        this.saving.set(false);
      },
    });
  }
}
