import { Component, inject, signal, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { extractApiError } from '../../core/utils/api-error.util';

interface RHFormData {
  name: string;
  email: string;
  company: string;
  password: string;
  confirm: string;
  cgu: boolean;
}

class Validators {
  static email = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  static password = (pwd: string): boolean => /^(?=.*[A-Z])(?=.*\d)(?=.*[a-z]).{8,}$/.test(pwd);
}

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <!-- Partie gauche -->
      <div class="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden">
        <div class="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Team collaboration"
            class="w-full h-full object-cover"
          />
        </div>
        
        <div class="relative z-10">
          <div 
            class="flex items-center gap-2.5 mb-12 cursor-pointer hover:opacity-80 transition-opacity" 
            (click)="goToHome()"
          >
            <span class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 backdrop-blur">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </span>
            <span class="text-2xl font-bold">ProfilCheck</span>
          </div>
          <h1 class="text-4xl font-bold mb-4">Créez votre compte RH</h1>
          <p class="text-white/80 text-lg max-w-md">
            Rejoignez ProfilCheck et gérez vos tests de vérification en toute simplicité.
          </p>
        </div>
        
        <div class="relative z-10 space-y-3">
          @for (benefit of benefits; track benefit) {
            <div class="flex items-center gap-2 text-white/90 text-sm">
              <svg class="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {{ benefit }}
            </div>
          }
        </div>
        
        <div class="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <!-- Partie droite -->
      <div class="flex items-center justify-center p-6 sm:p-12 bg-gray-50 dark:bg-slate-900">
        <div class="w-full max-w-2xl">
          <div 
            class="lg:hidden flex items-center justify-center gap-2 mb-8 cursor-pointer hover:opacity-80 transition-opacity"
            (click)="goToHome()"
          >
            <span class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ProfilCheck</span>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 dark:border-slate-700">
            
            <!-- Messages -->
            @if (errorMessage()) {
              <div class="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p class="text-sm text-red-600 dark:text-red-400 text-center">{{ errorMessage() }}</p>
              </div>
            }

            @if (successMessage()) {
              <div class="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p class="text-sm text-green-600 dark:text-green-400 text-center">{{ successMessage() }}</p>
              </div>
            }

            <!-- Formulaire unique -->
            <div class="space-y-5">
              <div class="text-center mb-6">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Inscription</h2>
                <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">Créez votre espace entreprise</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nom complet *</label>
                <input 
                  type="text" 
                  [(ngModel)]="rhForm.name" 
                  class="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
                  placeholder="Jean Dupont" 
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email professionnel *</label>
                <input 
                  type="email" 
                  [(ngModel)]="rhForm.email" 
                  class="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
                  placeholder="vous@entreprise.com" 
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nom de l'entreprise *</label>
                <input 
                  type="text" 
                  [(ngModel)]="rhForm.company" 
                  class="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
                  placeholder="MaSuperEntreprise" 
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Mot de passe *</label>
                <input 
                  type="password" 
                  [(ngModel)]="rhForm.password" 
                  class="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
                  placeholder="8 caractères, 1 majuscule, 1 chiffre" 
                />
                <div class="mt-1 flex gap-3 text-xs">
                  <span [class.text-green-500]="passwordStrength.length" [class.text-gray-400]="!passwordStrength.length">
                    <svg class="w-3 h-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    8 caractères
                  </span>
                  <span [class.text-green-500]="passwordStrength.uppercase" [class.text-gray-400]="!passwordStrength.uppercase">
                    <svg class="w-3 h-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Majuscule
                  </span>
                  <span [class.text-green-500]="passwordStrength.number" [class.text-gray-400]="!passwordStrength.number">
                    <svg class="w-3 h-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    Chiffre
                  </span>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirmation *</label>
                <input 
                  type="password" 
                  [(ngModel)]="rhForm.confirm" 
                  class="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
                  placeholder="Confirmez le mot de passe" 
                />
                @if (rhForm.password && rhForm.confirm && rhForm.password !== rhForm.confirm) {
                  <p class="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas</p>
                }
              </div>

              <label class="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" [(ngModel)]="rhForm.cgu" class="mt-1 rounded" />
                <span class="text-xs text-slate-600 dark:text-slate-400">
                  J'accepte les <a href="/cgu" class="text-indigo-600 underline">conditions générales d'utilisation</a> *
                </span>
              </label>

              <div class="pt-4">
                <button 
                  type="button" 
                  (click)="register()"
                  [disabled]="isLoading() || !isFormValid()"
                  class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  @if (isLoading()) {
                    <div class="flex items-center justify-center gap-2">
                      <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Création du compte...</span>
                    </div>
                  } @else {
                    <span>S'inscrire</span>
                  }
                </button>
              </div>

              <div class="text-center pt-4">
                <p class="text-sm text-slate-600 dark:text-slate-400">
                  Vous avez déjà un compte ? 
                  <a routerLink="/login" class="text-indigo-600 hover:text-indigo-700 font-medium">Se connecter</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly benefits = ['1 test gratuit par mois', 'Aucune carte bancaire requise', 'Configuration en 5 minutes', 'Support 24/7'];
  
  rhForm: RHFormData = {
    name: '',
    email: '',
    company: '',
    password: '',
    confirm: '',
    cgu: false
  };

  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  passwordStrength = { length: false, uppercase: false, number: false, lowercase: false };

  constructor() {
    effect(() => {
      this.updatePasswordStrength(this.rhForm.password);
    });
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  isFormValid(): boolean {
    return this.rhForm.name.trim() !== '' &&
           Validators.email(this.rhForm.email) &&
           this.rhForm.company.trim() !== '' &&
           Validators.password(this.rhForm.password) &&
           this.rhForm.password === this.rhForm.confirm &&
           this.rhForm.cgu === true;
  }

  register(): void {
    if (!this.isFormValid()) {
      this.errorMessage.set('Veuillez remplir tous les champs correctement');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.auth.register({
      name: this.rhForm.name.trim(),
      email: this.rhForm.email.trim(),
      company: this.rhForm.company.trim(),
      password: this.rhForm.password,
    }).subscribe({
      next: (user) => {
        this.successMessage.set(`Compte RH créé avec succès ! Bienvenue ${user.fullName}`);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(extractApiError(err));
        this.isLoading.set(false);
      },
    });
  }

  private updatePasswordStrength(password: string): void {
    this.passwordStrength = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      lowercase: /[a-z]/.test(password)
    };
  }

}