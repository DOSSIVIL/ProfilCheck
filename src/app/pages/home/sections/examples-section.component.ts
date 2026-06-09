import { Component } from '@angular/core';

@Component({
  selector: 'app-examples-section',
  template: `
    <section id="examples" class="py-16 md:py-24 lg:py-32 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- En-tête -->
        <div class="text-center max-w-3xl mx-auto mb-12 md:mb-16 lg:mb-20">
          <div class="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-full mb-4">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span class="text-xs sm:text-sm font-medium">Cas d'usage réels</span>
          </div>
          
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 lg:mb-6 leading-tight">
            Des tests que vous ne pouvez pas tricher
          </h2>
          
          <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Chaque question est générée en temps réel à partir du profil déclaré. Voici des exemples concrets.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          @for (example of examples; track example.role) {
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div class="p-6 lg:p-8">
                
                <!-- En-tête de la carte -->
                <div class="flex items-center gap-4 mb-6">
                  <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" [attr.d]="example.iconPath" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-xl text-slate-900 dark:text-white">{{ example.role }}</h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400">{{ example.experience }}</p>
                  </div>
                </div>

                <div class="space-y-4">
                  
                  <!-- Profil déclaré -->
                  <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
                    <div class="flex items-center gap-2 mb-2">
                      <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p class="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Profil déclaré</p>
                    </div>
                    <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{{ example.profile }}</p>
                  </div>

                  <!-- Question générée -->
                  <div class="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                    <div class="flex items-center gap-2 mb-2">
                      <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p class="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Question générée</p>
                    </div>
                    <p class="text-sm text-slate-800 dark:text-slate-200 font-medium italic leading-relaxed">"{{ example.question }}"</p>
                  </div>

                  <!-- Réponse attendue -->
                  <div class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
                    <div class="flex items-center gap-2 mb-3">
                      <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p class="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Réponse attendue</p>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      @for (tag of example.expected; track tag) {
                        <span class="px-3 py-1.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                          {{ tag }}
                        </span>
                      }
                    </div>
                  </div>

                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class ExamplesSectionComponent {
  protected readonly examples = [
    {
      iconPath: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      role: 'Ingénieur logiciel',
      experience: '15 ans d\'expérience',
      profile: 'Expert Java/Spring, architecture microservices, optimisation SQL, déploiement cloud AWS.',
      question: 'Votre API Spring Boot subit des pics de charge. Décrivez votre stratégie de cache, la gestion des microservices et l\'optimisation des requêtes SQL sous contrainte.',
      expected: ['Cache Redis', 'Microservices', 'SQL indexing', 'CDN'],
    },
    {
      iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      role: 'Data Scientist',
      experience: 'Junior — 2 ans',
      profile: 'Python, scikit-learn, pandas, modèles de classification, pipelines ML basiques.',
      question: 'Vous entraînez un modèle de classification sur un dataset déséquilibré. Comment évitez-vous le data leakage et gérez-vous le distribution shift en production ?',
      expected: ['Data leakage', 'Distribution shift', 'Overfitting', 'Cross-validation'],
    },
  ];
}