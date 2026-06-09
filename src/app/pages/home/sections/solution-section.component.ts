import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Step {
  icon: 'search' | 'brain' | 'chart';
  title: string;
  description: string;
}

@Component({
  selector: 'app-solution-section',
  imports: [CommonModule],
  template: `
    <section 
      id="solution" 
      class="relative py-20 px-6 lg:py-32 lg:px-8 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-orange-950 transition-colors duration-500"
      aria-labelledby="solution-title"
    >
      <!-- Background Decorations - Soft Orange -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-orange-300/6 dark:bg-orange-700/3 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-300/6 dark:bg-amber-700/3 rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-200/4 dark:bg-orange-800/2 rounded-full blur-3xl"></div>
      </div>

      <div class="relative max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
          <!-- Badge with AI Icon - Soft Orange -->
          <div class="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 text-orange-700 dark:text-orange-300 text-sm font-semibold mb-6 shadow-lg border border-orange-100 dark:border-orange-800" role="note">
            <!-- AI/Brain SVG Icon -->
            <svg class="w-4.5 h-4.5 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1m-4.021 7.979l-.707-.707M12 18a6 6 0 110-12 6 6 0 010 12zm0 0v1m-6.364-1.636l.707.707M3 12h1m4.021-7.979l.707.707" />
            </svg>
            Notre solution IA
          </div>

          <!-- Title with Soft Orange Gradient -->
          <h1 id="solution-title" class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 animate-fade-in animation-delay-100">
            <span class="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 dark:from-orange-400 dark:via-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
              Comment ProfilCheck
            </span>
            <br class="md:hidden" />
            <span class="text-slate-900 dark:text-white">
              transforme la vérification RH
            </span>
          </h1>

          <!-- Description -->
          <p class="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed animate-fade-in animation-delay-200 max-w-2xl mx-auto">
            Une approche en trois étapes, propulsée par <span class="font-semibold text-orange-600 dark:text-orange-400">Grok</span>, pour une évaluation objective et contextualisée.
          </p>
        </div>

        <!-- Steps Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6" role="list" aria-label="Processus de vérification en 3 étapes">
          @for (step of steps; track step.title; let i = $index) {
            <div 
              class="relative p-8 group animate-fade-in-up animation-delay-{{(i + 1) * 100}} overflow-hidden rounded-2xl"
              role="listitem"
              [attr.aria-label]="'Étape ' + (i + 1) + ': ' + step.title"
            >
              <!-- Card Background -->
              <div class="absolute inset-0 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl"></div>
              
              <!-- HOVER GLOW EFFECT - Soft Orange on Container -->
              <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"
                   style="box-shadow: 0 0 40px rgba(251, 146, 60, 0.15), 0 0 80px rgba(251, 146, 60, 0.08);"></div>
              
              <!-- Border -->
              <div class="absolute inset-0 rounded-2xl border border-gray-200 dark:border-slate-700 group-hover:border-orange-200 dark:group-hover:border-orange-700 transition-colors duration-300"></div>
              
              <!-- Content -->
              <div class="relative">
                <!-- Step Number Badge - BIGGER, Top Right Corner -->
                <div class="absolute top-4 right-6 w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 text-white text-lg font-bold flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 z-10"
                     aria-hidden="true">
                  {{ i + 1 }}
                </div>
                
                <!-- Icon Container - Soft Orange -->
                <div class="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500"
                     aria-hidden="true">
                  <!-- Inner Glow - Soft -->
                  <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-400/10 to-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  @if (i === 0) {
                    <!-- Search Icon - Soft Orange -->
                    <svg class="w-10 h-10 text-orange-500 dark:text-orange-400 group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 17 13m0 0 6.5-6.5m0 0H21v4.5m0-4.5l-8.5 8.5m-3-7a4 4 0 110-8 4 4 0 010 8zm-1 4l-4 4a1 1 0 001.414 1.414L10.5 13H14a4 4 0 100-8v4.586l-5.293-5.293a1 1 0 00-1.414 1.414L10.5 9H7a4 4 0 100 8v-4.586z" />
                    </svg>
                  } @else if (i === 1) {
                    <!-- Brain/AI Icon - Soft Orange -->
                    <svg class="w-10 h-10 text-orange-500 dark:text-orange-400 group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.5M12 7.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM8.5 10a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM15.5 10a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM9 15.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM18 15.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM12 21a9 9 0 110-18 9 9 0 010 18z" />
                    </svg>
                  } @else if (i === 2) {
                    <!-- Chart/Stats Icon - Soft Orange -->
                    <svg class="w-10 h-10 text-orange-500 dark:text-orange-400 group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.5V6a3 3 0 013-3h12a3 3 0 013 3v7.5m-3-3v6a3 3 0 01-3 3H6a3 3 0 01-3-3v-6a3 3 0 013-3h12a3 3 0 013 3z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2 2 2 2-2 2 2" />
                    </svg>
                  }
                </div>
                
                <!-- Title -->
                <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                  {{ step.title }}
                </h3>
                
                <!-- Description -->
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-300">
                  {{ step.description }}
                </p>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Animation Keyframes -->
      <style>
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; }
        .animate-fade-in { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
      </style>
    </section>
  `
})
export class SolutionSectionComponent {
  protected readonly steps: Step[] = [
    { icon: 'search', title: 'Analyse automatique du profil', description: 'Importez le CV, le poste et l\'expérience. L\'IA extrait les compétences clés et identifie les zones à valider.' },
    { icon: 'brain', title: 'Génération contextuelle de tests (Grok)', description: 'Des questions techniques uniques, adaptées au niveau et au domaine de chaque collaborateur. Impossible à tricher.' },
    { icon: 'chart', title: 'Score de conformité objectif', description: 'Un rapport détaillé avec score, écarts identifiés et recommandations pour le manager RH ou technique.' },
  ];
}