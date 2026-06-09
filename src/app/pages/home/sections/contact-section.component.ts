import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-section',
  imports: [FormsModule],
  template: `
    <section id="contact" class="py-16 md:py-24 lg:py-32 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- En-tête -->
        <div class="text-center max-w-3xl mx-auto mb-12 md:mb-16 lg:mb-20">
          <div class="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-full mb-4">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span class="text-xs sm:text-sm font-medium">Restons en contact</span>
          </div>
          
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 lg:mb-6 leading-tight">
            Une question ? Parlons-en
          </h2>
        </div>

        <!-- Grille avec hauteur égale -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          <!-- Formulaire - prend toute la hauteur disponible -->
          <form
            class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 lg:p-8 space-y-5 h-full flex flex-col"
            (ngSubmit)="onSubmit()"
          >
            <div class="flex-1 space-y-5">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nom *</label>
                  <input
                    type="text"
                    [(ngModel)]="form.name"
                    name="name"
                    required
                    class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email *</label>
                  <input
                    type="email"
                    [(ngModel)]="form.email"
                    name="email"
                    required
                    class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors"
                    placeholder="vous@entreprise.com"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Entreprise</label>
                <input
                  type="text"
                  [(ngModel)]="form.company"
                  name="company"
                  class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors"
                  placeholder="Nom de votre entreprise"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message *</label>
                <textarea
                  [(ngModel)]="form.message"
                  name="message"
                  rows="4"
                  required
                  class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors resize-none"
                  placeholder="Comment pouvons-nous vous aider ?"
                ></textarea>
              </div>

              <label class="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  [(ngModel)]="form.rgpd"
                  name="rgpd"
                  required
                  class="mt-1 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  J'accepte que mes données soient traitées conformément à la politique RGPD de ProfilCheck.
                </span>
              </label>
            </div>

            <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all transform hover:scale-105 shadow-md mt-4">
              Envoyer le message
            </button>

            @if (submitted()) {
              <div class="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400 text-center font-medium animate-fade-in">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Message envoyé ! Nous vous répondrons sous 24h.</span>
              </div>
            }
          </form>

          <!-- Colonne droite - prend toute la hauteur -->
          <div class="space-y-6 lg:space-y-8 h-full flex flex-col">
            
            <!-- Coordonnées -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 lg:p-8 flex-1">
              <h3 class="font-bold text-xl text-slate-900 dark:text-white mb-6">Coordonnées</h3>
              <ul class="space-y-5">
                @for (info of contactInfo; track info.label) {
                  <li class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center flex-shrink-0">
                      <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" [attr.d]="info.iconPath" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{{ info.label }}</p>
                      <p class="text-sm font-medium text-slate-900 dark:text-white mt-0.5">{{ info.value }}</p>
                    </div>
                  </li>
                }
              </ul>
            </div>

            <!-- Newsletter -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 lg:p-8">
              <div class="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="font-bold text-xl text-slate-900 dark:text-white mb-2">Newsletter</h3>
              <p class="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
                Recevez nos actualités produit et conseils RH.
              </p>
              <div class="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="votre@email.com"
                  class="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors"
                />
                <button type="button" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all transform hover:scale-105 text-sm whitespace-nowrap">
                  S'abonner
                </button>
              </div>
            </div>

            <!-- Disponibilité -->
            <div class="bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-950/30 dark:to-cyan-950/30 rounded-2xl p-6 lg:p-8 border border-indigo-100 dark:border-indigo-900/30">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                  <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-indigo-900 dark:text-indigo-300">Support prioritaire</p>
                  <p class="text-xs text-indigo-700 dark:text-indigo-400 mt-1">Réponse sous 24h ouvrées</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  `,
})
export class ContactSectionComponent {
  protected readonly submitted = signal(false);

  protected form = {
    name: '',
    email: '',
    company: '',
    message: '',
    rgpd: false,
  };

  protected readonly contactInfo = [
    { 
      label: 'Email', 
      value: 'contact@profilcheck.com',
      iconPath: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
    },
    { 
      label: 'Téléphone', 
      value: '+33 1 84 80 00 00',
      iconPath: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
    },
    { 
      label: 'Adresse', 
      value: '42 Avenue des Champs-Élysées, 75008 Paris',
      iconPath: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z'
    },
  ];

  onSubmit(): void {
    if (this.form.name && this.form.email && this.form.message && this.form.rgpd) {
      this.submitted.set(true);
      this.form = { name: '', email: '', company: '', message: '', rgpd: false };
      setTimeout(() => this.submitted.set(false), 4000);
    }
  }
}