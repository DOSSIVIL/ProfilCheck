import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pricing-section',
  imports: [RouterLink],
  template: `
    <section id="pricing" class="section-padding bg-gray-50 dark:bg-dark-surface transition-colors duration-300">
      <div class="max-w-7xl mx-auto">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <span class="section-badge mb-4">💰 Tarifs transparents</span>
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-dark dark:text-dark-text mb-6">
            Choisissez l'offre adaptée à vos besoins
          </h2>
          <p class="text-lg text-gray-600 dark:text-dark-text-secondary">
            Commencez gratuitement, évoluez quand vous êtes prêt. Sans engagement.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          @for (plan of plans; track plan.name) {
            <div
              class="card p-8 flex flex-col border relative"
              [class]="plan.highlighted
                ? 'border-primary shadow-xl shadow-primary/10 scale-[1.02] dark:border-secondary'
                : 'border-gray-100 dark:border-dark-border'"
            >
              @if (plan.highlighted) {
                <span class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-primary to-secondary text-white">
                  Populaire
                </span>
              }

              <div class="mb-6">
                <h3 class="text-xl font-bold text-dark dark:text-dark-text mb-1">{{ plan.name }}</h3>
                <p class="text-sm text-gray-500 dark:text-dark-text-secondary">{{ plan.description }}</p>
              </div>

              <div class="mb-8">
                <span class="text-4xl font-bold text-dark dark:text-dark-text">{{ plan.price }}</span>
                @if (plan.period) {
                  <span class="text-gray-500 dark:text-dark-text-secondary text-sm">{{ plan.period }}</span>
                }
              </div>

              <ul class="space-y-3 mb-8 flex-1">
                @for (feature of plan.features; track feature) {
                  <li class="flex items-start gap-2.5 text-sm text-gray-600 dark:text-dark-text-secondary">
                    <svg class="w-5 h-5 text-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {{ feature }}
                  </li>
                }
              </ul>

              <a
                [routerLink]="plan.ctaLink"
                class="text-center w-full"
                [class]="plan.highlighted ? 'btn-primary' : 'btn-secondary'"
              >
                {{ plan.cta }}
              </a>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class PricingSectionComponent {
  protected readonly plans = [
    {
      name: 'Gratuit',
      description: 'Pour découvrir la plateforme',
      price: '0€',
      period: '/mois',
      features: [
        '1 test par mois',
        '1 profil employé',
        'Rapport basique',
        'Support communautaire',
      ],
      cta: 'Commencer gratuitement',
      ctaLink: '/register',
      highlighted: false,
    },
    {
      name: 'Pro',
      description: 'Pour les équipes en croissance',
      price: '49€',
      period: '/mois',
      features: [
        'Tests illimités',
        'Jusqu\'à 50 profils',
        'Dashboard RH complet',
        'Export PDF & API',
        'Support prioritaire',
      ],
      cta: 'Essayer Pro',
      ctaLink: '/register',
      highlighted: true,
    },
    {
      name: 'Entreprise',
      description: 'Pour les grandes organisations',
      price: 'Sur devis',
      period: '',
      features: [
        'Profils illimités',
        'SSO & intégrations SIRH',
        'SLA garanti 99.9%',
        'Account manager dédié',
        'Formation sur site',
      ],
      cta: 'Nous contacter',
      ctaLink: '/register',
      highlighted: false,
    },
  ];
}
