import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly isDark = signal(false);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const stored = localStorage.getItem('profilcheck-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = stored === 'dark' || (!stored && prefersDark);
    this.isDark.set(dark);
    this.apply(dark);
  }

  toggle(): void {
    this.isDark.update((value) => !value);
    if (isPlatformBrowser(this.platformId)) {
      this.apply(this.isDark());
      localStorage.setItem('profilcheck-theme', this.isDark() ? 'dark' : 'light');
    }
  }

  private apply(dark: boolean): void {
    document.documentElement.classList.toggle('dark', dark);
  }
}
