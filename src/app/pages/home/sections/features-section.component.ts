import { Component } from '@angular/core';

interface Feature {
  iconPath: string;
  bgClass: string;
  iconClass: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-features-section',
  template: `
    <section id="features" class="py-16 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 relative">
      <!-- Séparation visible en light et dark mode -->
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- En-tête -->
        <div class="text-center max-w-3xl mx-auto mb-12 md:mb-16 lg:mb-20">
          <div class="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-full mb-4">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span class="text-xs sm:text-sm font-medium">Fonctionnalités</span>
          </div>
          
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 lg:mb-6 leading-tight">
            Tout ce dont vous avez besoin pour certifier les compétences
          </h2>
        </div>

        <!-- Grille des fonctionnalités -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          @for (feature of features; track feature.title) {
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 group p-6 lg:p-8">
              <div
                class="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                [class]="feature.bgClass"
              >
                <svg class="w-7 h-7" [class]="feature.iconClass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" [attr.d]="feature.iconPath" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">{{ feature.title }}</h3>
              <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{{ feature.description }}</p>
            </div>
          }
        </div>
      </div>
      
      <!-- Séparation visible en light et dark mode -->
      <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent"></div>
    </section>
  `,
})
export class FeaturesSectionComponent {
  protected readonly features: Feature[] = [
    {
      iconPath: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
      bgClass: 'bg-indigo-50 dark:bg-indigo-900/20',
      iconClass: 'text-indigo-600 dark:text-indigo-400',
      title: 'Génération IA',
      description: 'Tests uniques générés par Grok, adaptés au profil, au poste et au niveau d\'expérience de chaque collaborateur.',
    },
    {
      iconPath: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
      bgClass: 'bg-cyan-50 dark:bg-cyan-900/20',
      iconClass: 'text-cyan-600 dark:text-cyan-400',
      title: 'Scoring intelligent',
      description: 'Évaluation automatique des réponses avec score de conformité, analyse des écarts et recommandations.',
    },
    {
      iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      bgClass: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconClass: 'text-emerald-600 dark:text-emerald-400',
      title: 'Dashboard RH',
      description: 'Vue consolidée de toute l\'équipe : scores, tendances, alertes et exports pour les comités de direction.',
    },
    {
      iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      bgClass: 'bg-amber-50 dark:bg-amber-900/20',
      iconClass: 'text-amber-600 dark:text-amber-400',
      title: 'Suivi longitudinal',
      description: 'Historique des tests passés, évolution des compétences et détection des régressions dans le temps.',
    },
    {
      iconPath: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
      bgClass: 'bg-violet-50 dark:bg-violet-900/20',
      iconClass: 'text-violet-600 dark:text-violet-400',
      title: 'API ouverte',
      description: 'Intégrez ProfilCheck à votre SIRH, ATS ou LMS via notre API REST documentée et nos webhooks.',
    },
    {
      iconPath: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      bgClass: 'bg-rose-50 dark:bg-rose-900/20',
      iconClass: 'text-rose-600 dark:text-rose-400',
      title: 'Sécurité RGPD',
      description: 'Données hébergées en UE, chiffrement bout-en-bout, conformité RGPD et droit à l\'effacement garanti.',
    },
  ];
}