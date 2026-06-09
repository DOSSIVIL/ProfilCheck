import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';

const NAV_LINKS = [
  { label: 'Problème', href: '#problem' },
  { label: 'Solution', href: '#solution' },
  { label: 'Exemples', href: '#examples' },
  { label: 'Fonctionnalités', href: '#features' },
  { label: 'Témoignages', href: '#testimonials' },
  { label: 'Tarifs', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
];

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  template: `
    <header
      class="fixed top-0 left-0 right-0 z-50 glass transition-colors duration-300"
    >
      <nav class="w-full px-4 sm:px-6 lg:px-8">
        <div class="relative flex items-center h-16 lg:h-20 w-full">
          <a href="#" class="flex items-center gap-2.5 group shrink-0">
            <span
              class="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-md group-hover:scale-105 transition-transform"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </span>
            <span class="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ProfilCheck
            </span>
          </a>

          <div class="hidden lg:flex items-center justify-center gap-1 absolute left-1/2 -translate-x-1/2">
            @for (link of navLinks; track link.href) {
              <a
                [href]="link.href"
                class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary rounded-lg transition-colors dark:text-dark-text-secondary dark:hover:text-white"
              >
                {{ link.label }}
              </a>
            }
          </div>

          <div class="hidden lg:flex items-center gap-3 shrink-0 ml-auto">
            <button
              type="button"
              (click)="theme.toggle()"
              class="p-2.5 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-dark-text-secondary dark:hover:bg-dark-surface transition-colors"
              [attr.aria-label]="theme.isDark() ? 'Mode clair' : 'Mode sombre'"
            >
              @if (theme.isDark()) {
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              } @else {
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              }
            </button>
            @if (auth.isAuthenticated()) {
              <a routerLink="/rh/dashboard" class="btn-primary text-sm px-5 py-2.5">Mon espace RH</a>
            } @else {
              <a routerLink="/login" class="btn-secondary text-sm px-5 py-2.5">Se connecter</a>
              <a routerLink="/register" class="btn-primary text-sm px-5 py-2.5">Essayer gratuitement</a>
            }
          </div>

          <div class="flex lg:hidden items-center gap-2 shrink-0 ml-auto">
            <button
              type="button"
              (click)="theme.toggle()"
              class="p-2 rounded-lg text-gray-600 dark:text-dark-text-secondary"
              [attr.aria-label]="theme.isDark() ? 'Mode clair' : 'Mode sombre'"
            >
              @if (theme.isDark()) {
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              } @else {
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              }
            </button>
            <button
              type="button"
              (click)="toggleMenu()"
              class="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-dark-text dark:hover:bg-dark-surface"
              aria-label="Menu"
            >
              @if (menuOpen()) {
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              } @else {
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              }
            </button>
          </div>
        </div>

        @if (menuOpen()) {
          <div class="lg:hidden pb-4 animate-slide-up">
            <div class="flex flex-col gap-1 p-2 rounded-2xl bg-white/90 dark:bg-dark-surface/90 backdrop-blur-md border border-gray-100 dark:border-dark-border">
              @for (link of navLinks; track link.href) {
                <a
                  [href]="link.href"
                  (click)="closeMenu()"
                  class="px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors dark:text-dark-text dark:hover:bg-primary/10"
                >
                  {{ link.label }}
                </a>
              }
              <div class="flex flex-col gap-2 pt-3 mt-2 border-t border-gray-100 dark:border-dark-border">
                @if (auth.isAuthenticated()) {
                  <a routerLink="/rh/dashboard" (click)="closeMenu()" class="btn-primary text-sm text-center">Mon espace RH</a>
                } @else {
                  <a routerLink="/login" (click)="closeMenu()" class="btn-secondary text-sm text-center">Se connecter</a>
                  <a routerLink="/register" (click)="closeMenu()" class="btn-primary text-sm text-center">S'inscrire</a>
                }
              </div>
            </div>
          </div>
        }
      </nav>
    </header>
  `,
})
export class NavbarComponent {
  protected readonly theme = inject(ThemeService);
  protected readonly auth = inject(AuthService);
  protected readonly navLinks = NAV_LINKS;
  protected readonly menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
