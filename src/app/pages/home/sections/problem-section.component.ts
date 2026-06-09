import { Component } from '@angular/core';

@Component({
  selector: 'app-problem-section',
  template: `
    <section id="problem" class="py-16 md:py-24 lg:py-32 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- En-tête -->
        <div class="text-center max-w-3xl mx-auto mb-12 md:mb-16 lg:mb-20">
          <div class="inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-1.5 rounded-full mb-4">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span class="text-xs sm:text-sm font-medium">Le constat</span>
          </div>
          
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 lg:mb-6 leading-tight">
            Des CV toujours plus beaux,<br/>
            des compétences toujours moins vérifiées
          </h2>
          
          <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Le recrutement moderne repose sur la confiance, mais les données montrent un écart croissant entre les compétences déclarées et la réalité terrain.
          </p>
        </div>

        <!-- Cartes -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          
          <!-- Carte 1 - Profils auto-déclarés -->
          <div class="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div class="p-6 lg:p-8">
              <div class="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-6">
                <svg class="w-7 h-7 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              
              <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Profils auto-déclarés
              </h3>
              
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Les candidats et employés surestiment souvent leurs compétences techniques lors des entretiens et des CV.
              </p>
              
              <div class="pt-4 border-t border-slate-100 dark:border-slate-700">
                <div class="flex items-baseline gap-2">
                  <span class="text-2xl font-bold text-red-600 dark:text-red-400">67%</span>
                  <span class="text-sm text-slate-500 dark:text-slate-400">d'exagérations constatées</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Carte 2 - Recrutements à distance -->
          <div class="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div class="p-6 lg:p-8">
              <div class="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-6">
                <svg class="w-7 h-7 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4-3-9s1.34-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              
              <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Recrutements à distance
              </h3>
              
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Le télétravail et le recrutement international rendent la vérification des compétences encore plus difficile.
              </p>
              
              <div class="pt-4 border-t border-slate-100 dark:border-slate-700">
                <div class="flex items-baseline gap-2">
                  <span class="text-2xl font-bold text-amber-600 dark:text-amber-400">3x</span>
                  <span class="text-sm text-slate-500 dark:text-slate-400">plus de candidatures distantes</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Carte 3 - Conséquences opérationnelles -->
          <div class="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div class="p-6 lg:p-8">
              <div class="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mb-6">
                <svg class="w-7 h-7 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Conséquences opérationnelles
              </h3>
              
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Des compétences non maîtrisées entraînent retards, bugs, surcoûts et perte de confiance des clients.
              </p>
              
              <div class="pt-4 border-t border-slate-100 dark:border-slate-700">
                <div class="flex items-baseline gap-2">
                  <span class="text-2xl font-bold text-orange-600 dark:text-orange-400">-23%</span>
                  <span class="text-sm text-slate-500 dark:text-slate-400">de productivité en moyenne</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `,
})
export class ProblemSectionComponent {}