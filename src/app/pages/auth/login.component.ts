import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { extractApiError } from '../../core/utils/api-error.util';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  template: `
    <div class="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div class="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary to-secondary text-white relative overflow-hidden">
        <div class="relative z-10">
          <a href="/" class="flex items-center gap-2.5 mb-12">
            <span class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 backdrop-blur">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </span>
            <span class="text-2xl font-bold">ProfilCheck</span>
          </a>
          <h1 class="text-4xl font-bold mb-4">Retrouvez votre espace de travail</h1>
          <p class="text-white/80 text-lg max-w-md">
            Accédez à vos tests, résultats et tableaux de bord RH en un clic.
          </p>
        </div>
        <blockquote class="relative z-10 border-l-4 border-white/40 pl-4 text-white/90 italic">
          "ProfilCheck a transformé notre processus de vérification des compétences."
          <footer class="mt-2 text-sm not-italic text-white/70">— Sophie M., DRH</footer>
        </blockquote>
        <div class="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div class="flex items-center justify-center p-6 sm:p-12 bg-gray-50 dark:bg-dark-bg">
        <div class="w-full max-w-md">
          <a href="/" class="lg:hidden flex items-center gap-2 mb-8">
            <span class="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">ProfilCheck</span>
          </a>

          <div class="glass card p-8 border border-gray-100 dark:border-dark-border">
            <h2 class="text-2xl font-bold text-dark dark:text-dark-text mb-1">Connexion</h2>
            <p class="text-sm text-gray-600 dark:text-dark-text-secondary mb-8">Entrez vos identifiants</p>

            @if (errorMessage()) {
              <div class="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p class="text-sm text-red-600 dark:text-red-400 text-center">{{ errorMessage() }}</p>
              </div>
            }

            <form class="space-y-5" (ngSubmit)="onSubmit()">
              <div>
                <label class="block text-sm font-medium mb-1.5 dark:text-dark-text">Email</label>
                <input type="email" [(ngModel)]="email" name="email" required
                  class="w-full rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-surface px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-dark-text"
                  placeholder="vous@entreprise.com" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5 dark:text-dark-text">Mot de passe</label>
                <div class="relative">
                  <input
                    [type]="showPassword() ? 'text' : 'password'"
                    [(ngModel)]="password"
                    name="password"
                    required
                    class="w-full rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-surface px-4 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-dark-text"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    (click)="togglePassword()"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                    [attr.aria-label]="showPassword() ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                  >
                    @if (showPassword()) {
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    } @else {
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    }
                  </button>
                </div>
              </div>
              <div class="flex items-center justify-between text-sm">
                <label class="flex items-center gap-2 cursor-pointer dark:text-dark-text-secondary">
                  <input type="checkbox" class="rounded text-primary focus:ring-primary" />
                  Se souvenir de moi
                </label>
                <a href="#" class="text-primary hover:underline">Mot de passe oublié ?</a>
              </div>
              <button type="submit" [disabled]="isLoading()" class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                @if (isLoading()) {
                  <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Connexion...
                } @else {
                  Se connecter
                }
              </button>
            </form>

            <div class="relative my-8">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200 dark:border-dark-border"></div>
              </div>
              <div class="relative flex justify-center text-xs uppercase">
                <span class="bg-white dark:bg-dark-surface px-3 text-gray-500 dark:text-dark-text-secondary">Ou continuer avec</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <button type="button" class="flex items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-dark-border px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>
              <button type="button" class="flex items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-dark-border px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                <svg class="w-5 h-5" viewBox="0 0 23 23"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>
                Microsoft
              </button>
            </div>

            <p class="mt-6 text-center text-sm text-gray-600 dark:text-dark-text-secondary">
              Pas encore de compte ?
              <a routerLink="/register" class="text-primary font-medium hover:underline">Créer un compte gratuitement</a>
            </p>

            <p class="mt-4 p-3 rounded-lg bg-primary/5 text-xs text-center text-primary dark:bg-primary/10">
              Démo : demo@profilcheck.com / demodemo
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  protected readonly showPassword = signal(false);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');

  togglePassword(): void {
    this.showPassword.update((value) => !value);
  }

  onSubmit(): void {
    if (!this.email.trim() || !this.password) {
      this.errorMessage.set('Veuillez remplir tous les champs');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.auth.login({ email: this.email.trim(), password: this.password }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/rh/dashboard']);
      },
      error: (err) => {
        this.errorMessage.set(extractApiError(err));
        this.isLoading.set(false);
      },
    });
  }
}
