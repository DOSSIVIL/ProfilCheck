import { Component } from '@angular/core';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  imageUrl: string;
  alt: string;
}

@Component({
  selector: 'app-testimonials-section',
  template: `
    <section id="testimonials" class="py-16 md:py-24 lg:py-32 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- En-tête -->
        <div class="text-center max-w-3xl mx-auto mb-12 md:mb-16 lg:mb-20">
          <div class="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-full mb-4">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span class="text-xs sm:text-sm font-medium">Ils nous font confiance</span>
          </div>
          
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 lg:mb-6 leading-tight">
            Ce que disent nos clients
          </h2>
        </div>

        <!-- Témoignages -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          
          @for (testimonial of testimonials; track testimonial.name) {
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 flex flex-col h-full">
              <div class="p-6 lg:p-8 flex flex-col h-full">
                
                <!-- Étoiles -->
                <div class="flex gap-1 mb-4">
                  @for (star of [1,2,3,4,5]; track star) {
                    <svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  }
                </div>

                <!-- Citation -->
                <blockquote class="text-slate-700 dark:text-slate-300 leading-relaxed flex-1 mb-6">
                  <svg class="w-8 h-8 text-indigo-200 dark:text-indigo-800 mb-2 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p class="text-sm lg:text-base italic leading-relaxed">"{{ testimonial.quote }}"</p>
                </blockquote>

                <!-- Profil -->
                <div class="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                  @if (testimonial.imageUrl) {
                    <img 
                      [src]="testimonial.imageUrl" 
                      [alt]="testimonial.alt"
                      class="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-100 dark:ring-indigo-900"
                      (error)="onImageError($event)"
                    />
                  } @else {
                    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {{ getInitials(testimonial.name) }}
                    </div>
                  }
                  <div>
                    <p class="font-semibold text-slate-900 dark:text-white text-sm">{{ testimonial.name }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">{{ testimonial.role }}</p>
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
export class TestimonialsSectionComponent {
  protected readonly testimonials: Testimonial[] = [
    {
      name: 'Sophie Martin',
      role: 'DRH — TechScale SAS',
      quote: 'ProfilCheck nous a permis d\'identifier des écarts de compétences que nos entretiens annuels ne détectaient pas. Un outil indispensable pour nos équipes techniques.',
      imageUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
      alt: 'Photo de Sophie Martin'
    },
    {
      name: 'Julien Dupont',
      role: 'CTO — DataFlow',
      quote: 'La génération de tests par IA est bluffante. Chaque question est pertinente et impossible à préparer à l\'avance. Nos recrutements sont enfin fiables.',
      imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      alt: 'Photo de Julien Dupont'
    },
    {
      name: 'Amélie Leroy',
      role: 'Responsable RH — InnoCorp',
      quote: 'Interface claire, résultats en 15 minutes, et un dashboard qui parle aux managers. Nous avons réduit nos erreurs de casting de 40% en 6 mois.',
      imageUrl: 'https://randomuser.me/api/portraits/women/45.jpg',
      alt: 'Photo de Amélie Leroy'
    }
  ];

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    // Ajouter un fallback avec les initiales
    const parent = img.parentElement;
    if (parent) {
      const initials = this.getInitials(img.alt.replace('Photo de ', ''));
      const fallbackDiv = document.createElement('div');
      fallbackDiv.className = 'w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm';
      fallbackDiv.textContent = initials;
      parent.appendChild(fallbackDiv);
    }
  }
}