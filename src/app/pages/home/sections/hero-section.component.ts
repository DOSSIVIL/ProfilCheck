import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-hero-section',
  imports: [RouterLink],
  template: `
    <section class="relative min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
      
      <!-- Container flex avec centrage vertical -->
      <div class="flex flex-col lg:flex-row min-h-screen w-full items-center pt-12 lg:pt-0">
        
        <!-- Container GAUCHE - Texte (50% largeur) -->
        <div class="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-0">
          <div class="max-w-lg w-full">
            
            <!-- Badge - Taille augmentée -->
            <div class="inline-flex items-center gap-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-full mb-5 shadow-sm">
              <svg class="w-2.5 h-2.5 text-indigo-500" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="4" />
              </svg>
              <span class="text-sm font-medium">✨ Nouvelle génération de vérification RH</span>
            </div>

            <!-- Titre - Tailles augmentées modérément -->
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
              <span class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Vérifiez objectivement
              </span>
              <br />
              <span class="text-gray-800 dark:text-white">
                les compétences de vos équipes avec l'IA
              </span>
            </h1>

            <!-- Description - Taille augmentée -->
            <p class="text-base text-gray-600 dark:text-gray-300 mb-7 leading-relaxed">
              ProfilCheck génère des tests techniques contextuels adaptés au profil de chaque employé.
              Détectez les non-conformités avant qu'elles n'impactent votre productivité.
            </p>

            <!-- Boutons - Tailles augmentées -->
            <div class="flex flex-col sm:flex-row gap-3 mb-9">
              <a routerLink="/register" class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 text-sm">
                Commencer gratuitement
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <a href="#examples" class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 hover:border-indigo-500 text-gray-700 dark:text-gray-200 font-semibold rounded-lg transition-all transform hover:scale-105 text-sm">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Voir la démo
              </a>
            </div>

            <!-- Stats - Tailles augmentées -->
            <div class="grid grid-cols-3 gap-3">
              <div class="text-center p-2.5 bg-white/60 dark:bg-slate-800/60 rounded-lg backdrop-blur-sm shadow-sm">
                <div class="flex justify-center mb-1.5">
                  <div class="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div class="text-xl font-bold text-indigo-600 dark:text-indigo-400">97%</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">de précision</div>
              </div>

              <div class="text-center p-2.5 bg-white/60 dark:bg-slate-800/60 rounded-lg backdrop-blur-sm shadow-sm">
                <div class="flex justify-center mb-1.5">
                  <div class="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div class="text-xl font-bold text-indigo-600 dark:text-indigo-400">15 min</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">par test</div>
              </div>

              <div class="text-center p-2.5 bg-white/60 dark:bg-slate-800/60 rounded-lg backdrop-blur-sm shadow-sm">
                <div class="flex justify-center mb-1.5">
                  <div class="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div class="text-xl font-bold text-indigo-600 dark:text-indigo-400">0</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">biais humain</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Container DROITE - Image (50% largeur) -->
        <div class="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-screen">
          @if (imageLoaded) {
            <img 
              [src]="heroImage" 
              alt="ProfilCheck IA" 
              class="w-full h-full object-cover absolute inset-0"
              (error)="onImageError()"
            />
          } @else {
            <div class="w-full h-full bg-gradient-to-br from-indigo-200 to-cyan-200 dark:from-indigo-800 dark:to-cyan-800 flex items-center justify-center">
              <div class="text-center p-8">
                <svg class="w-20 h-20 mx-auto mb-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p class="text-gray-700 dark:text-gray-300 font-medium">Visualisation des compétences</p>
                <p class="text-sm text-gray-500 mt-2">Placez l'image dans public/Images/1.png</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class HeroSectionComponent {
  protected readonly heroImage = 'Images/1.png';
  protected imageLoaded = true;
  
  onImageError(): void {
    this.imageLoaded = false;
    console.error('Image non trouvée :', this.heroImage);
  }
}