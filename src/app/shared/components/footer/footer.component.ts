import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="bg-gray-50 dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <a href="#" class="flex items-center gap-2.5 mb-4">
              <span class="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </span>
              <span class="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">ProfilCheck</span>
            </a>
            <p class="text-sm text-gray-600 dark:text-dark-text-secondary mb-4">
              La plateforme IA de référence pour vérifier objectivement les compétences professionnelles.
            </p>
            <div class="flex gap-3">
              <a href="#" aria-label="LinkedIn" class="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-500 hover:text-primary hover:border-primary transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.127 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="#" aria-label="Twitter" class="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-500 hover:text-primary hover:border-primary transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" aria-label="GitHub" class="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-500 hover:text-primary hover:border-primary transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 class="font-semibold text-dark dark:text-dark-text mb-4">Produit</h4>
            <ul class="space-y-2.5">
              @for (link of productLinks; track link.label) {
                <li>
                  <a [href]="link.href" class="text-sm text-gray-600 hover:text-primary dark:text-dark-text-secondary dark:hover:text-white transition-colors">
                    {{ link.label }}
                  </a>
                </li>
              }
            </ul>
          </div>

          <div>
            <h4 class="font-semibold text-dark dark:text-dark-text mb-4">Ressources</h4>
            <ul class="space-y-2.5">
              @for (link of resourceLinks; track link.label) {
                <li>
                  <a [href]="link.href" class="text-sm text-gray-600 hover:text-primary dark:text-dark-text-secondary dark:hover:text-white transition-colors">
                    {{ link.label }}
                  </a>
                </li>
              }
            </ul>
          </div>

          <div>
            <h4 class="font-semibold text-dark dark:text-dark-text mb-4">Légal</h4>
            <ul class="space-y-2.5">
              @for (link of legalLinks; track link.label) {
                <li>
                  <a [href]="link.href" class="text-sm text-gray-600 hover:text-primary dark:text-dark-text-secondary dark:hover:text-white transition-colors">
                    {{ link.label }}
                  </a>
                </li>
              }
            </ul>
          </div>
        </div>

        <div class="mt-12 pt-8 border-t border-gray-200 dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-sm text-gray-500 dark:text-dark-text-secondary">
            © {{ year }} ProfilCheck. Tous droits réservés.
          </p>
          <button
            type="button"
            (click)="theme.toggle()"
            class="flex items-center gap-2 text-sm text-gray-600 hover:text-primary dark:text-dark-text-secondary transition-colors"
          >
            @if (theme.isDark()) {
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
              Mode clair
            } @else {
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
              Mode sombre
            }
          </button>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  protected readonly theme = inject(ThemeService);
  protected readonly year = new Date().getFullYear();

  protected readonly productLinks = [
    { label: 'Fonctionnalités', href: '#features' },
    { label: 'Tarifs', href: '#pricing' },
    { label: 'API', href: '#features' },
    { label: 'Sécurité', href: '#features' },
  ];

  protected readonly resourceLinks = [
    { label: 'Documentation', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Centre d\'aide', href: '#' },
    { label: 'Statut', href: '#' },
  ];

  protected readonly legalLinks = [
    { label: 'Mentions légales', href: '#' },
    { label: 'Politique de confidentialité', href: '#' },
    { label: 'CGU', href: '#' },
    { label: 'RGPD', href: '#' },
  ];

}
