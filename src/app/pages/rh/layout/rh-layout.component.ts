import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: Date;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

@Component({
  selector: 'app-rh-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-dark-bg flex">
      <!-- Sidebar desktop -->
      <aside
        class="hidden lg:flex flex-col w-64 bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-dark-border fixed inset-y-0 z-30"
      >
        <div class="p-6 border-b border-gray-200 dark:border-dark-border">
          <a routerLink="/rh/dashboard" class="flex items-center gap-2.5">
            <div class="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <span class="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">ProfilCheck</span>
          </a>
          @if (auth.currentUser(); as user) {
            <div class="mt-3 flex items-center gap-1.5">
              <div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <p class="text-xs text-gray-500 dark:text-dark-text-secondary truncate">{{ user.company.name }}</p>
            </div>
          }
        </div>

        <nav class="flex-1 p-4 space-y-1">
          <p class="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-dark-text-secondary/60">
            Navigation
          </p>
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="nav-link-active"
              class="nav-link group"
            >
              <span [class]="'nav-icon-wrap ' + item.iconBg">
                @switch (item.id) {
                  @case ('dashboard') {
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                  }
                  @case ('employees') {
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  }
                  @case ('evaluations') {
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                    </svg>
                  }
                  @case ('profile') {
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  }
                }
              </span>
              <span class="flex-1 min-w-0">
                <span class="block text-sm font-semibold leading-tight">{{ item.label }}</span>
                <span class="nav-desc block text-[11px] text-gray-400 dark:text-dark-text-secondary/70 mt-0.5 truncate">
                  {{ item.description }}
                </span>
              </span>
            </a>
          }
        </nav>

        <div class="p-4 border-t border-gray-200 dark:border-dark-border">
          @if (auth.currentUser(); as user) {
            <div class="flex items-center gap-3 px-2 mb-3">
              <div class="relative">
                <div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold shadow-md">
                  {{ user.fullName.charAt(0).toUpperCase() }}
                </div>
                <div class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-dark-surface rounded-full"></div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate dark:text-dark-text">{{ user.fullName }}</p>
                <p class="text-xs text-gray-500 dark:text-dark-text-secondary truncate">{{ user.email }}</p>
              </div>
            </div>
          }
          <button
            (click)="auth.logout()"
            class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 group"
          >
            <svg class="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>

      <!-- Mobile sidebar overlay -->
      @if (sidebarOpen()) {
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fadeIn" (click)="sidebarOpen.set(false)"></div>
        <aside class="fixed inset-y-0 left-0 w-64 bg-white dark:bg-dark-surface z-50 lg:hidden flex flex-col animate-slideIn">
          <div class="p-4 flex items-center justify-between border-b border-gray-200 dark:border-dark-border">
            <span class="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">ProfilCheck</span>
            <button (click)="sidebarOpen.set(false)" class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav class="flex-1 p-4 space-y-1">
            <p class="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Navigation</p>
            @for (item of navItems; track item.path) {
              <a
                [routerLink]="item.path"
                routerLinkActive="nav-link-active"
                (click)="sidebarOpen.set(false)"
                class="nav-link group"
              >
                <span [class]="'nav-icon-wrap ' + item.iconBg">
                  @switch (item.id) {
                    @case ('dashboard') {
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                      </svg>
                    }
                    @case ('employees') {
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                    }
                    @case ('evaluations') {
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                      </svg>
                    }
                    @case ('profile') {
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    }
                  }
                </span>
                <span class="flex-1 min-w-0">
                  <span class="block text-sm font-semibold leading-tight">{{ item.label }}</span>
                  <span class="nav-desc block text-[11px] text-gray-400 mt-0.5 truncate">{{ item.description }}</span>
                </span>
              </a>
            }
          </nav>
        </aside>
      }

      <!-- Main content -->
      <div class="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header class="sticky top-0 z-20 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border px-4 sm:px-6 py-3 flex items-center justify-between">
          <button (click)="sidebarOpen.set(true)" class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <div class="hidden lg:block">
            <h1 class="text-lg font-semibold dark:text-dark-text">{{ pageTitle() }}</h1>
          </div>
          
          <div class="flex items-center gap-3">
            <!-- Theme Toggle -->
            <button
              (click)="theme.toggle()"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg transition-all duration-200 relative group"
              [attr.aria-label]="theme.isDark() ? 'Mode clair' : 'Mode sombre'"
            >
              @if (theme.isDark()) {
                <svg class="w-5 h-5 text-yellow-400 transition-transform group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
              } @else {
                <svg class="w-5 h-5 text-gray-600 transition-transform group-hover:-rotate-12" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.478-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd" />
                </svg>
              }
            </button>

            <!-- Notifications -->
            <div class="relative">
              <button
                (click)="toggleNotifications()"
                class="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg transition-all duration-200"
              >
                <svg class="w-5 h-5 text-gray-600 dark:text-dark-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                @if (unreadCount() > 0) {
                  <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                }
              </button>

              <!-- Notifications dropdown -->
              @if (showNotifications()) {
                <div class="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-surface rounded-xl shadow-xl border border-gray-200 dark:border-dark-border overflow-hidden z-50 animate-slideDown">
                  <div class="p-4 border-b border-gray-200 dark:border-dark-border flex items-center justify-between">
                    <h3 class="font-semibold dark:text-dark-text">Notifications</h3>
                    <button (click)="markAllAsRead()" class="text-xs text-primary hover:text-primary-dark transition-colors">
                      Tout marquer comme lu
                    </button>
                  </div>
                  <div class="max-h-96 overflow-y-auto">
                    @for (notif of notifications(); track notif.id) {
                      <div 
                        (click)="markAsRead(notif.id)"
                        class="p-4 border-b border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors cursor-pointer"
                        [class.opacity-60]="notif.read"
                      >
                        <div class="flex items-start gap-3">
                          <div class="flex-shrink-0">
                            @switch (notif.type) {
                              @case ('success') {
                                <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                  <svg class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                              }
                              @case ('warning') {
                                <div class="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                                  <svg class="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                  </svg>
                                </div>
                              }
                              @default {
                                <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                  <svg class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                              }
                            }
                          </div>
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium dark:text-dark-text">{{ notif.title }}</p>
                            <p class="text-xs text-gray-500 dark:text-dark-text-secondary mt-0.5">{{ notif.message }}</p>
                            <p class="text-xs text-gray-400 dark:text-dark-text-secondary/60 mt-1">{{ formatTime(notif.time) }}</p>
                          </div>
                          @if (!notif.read) {
                            <div class="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          }
                        </div>
                      </div>
                    }
                    @if (notifications().length === 0) {
                      <div class="p-8 text-center">
                        <svg class="w-12 h-12 mx-auto text-gray-400 dark:text-dark-text-secondary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <p class="text-sm text-gray-500 dark:text-dark-text-secondary">Aucune notification</p>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Profile dropdown -->
            <div class="relative">
              <button
                (click)="toggleProfileMenu()"
                class="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg transition-all duration-200"
              >
                @if (auth.currentUser(); as user) {
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {{ user.fullName.charAt(0).toUpperCase() }}
                  </div>
                  <svg class="w-4 h-4 text-gray-500 transition-transform" [class.rotate-180]="showProfileMenu()" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                }
              </button>

              <!-- Profile dropdown menu -->
              @if (showProfileMenu()) {
                <div class="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-surface rounded-xl shadow-xl border border-gray-200 dark:border-dark-border overflow-hidden z-50 animate-slideDown">
                  @if (auth.currentUser(); as user) {
                    <div class="p-4 border-b border-gray-200 dark:border-dark-border">
                      <p class="text-sm font-semibold dark:text-dark-text">{{ user.fullName }}</p>
                      <p class="text-xs text-gray-500 dark:text-dark-text-secondary mt-0.5">{{ user.email }}</p>
                    </div>
                  }
                  <div class="py-2">
                    <a routerLink="/rh/profile" (click)="showProfileMenu.set(false)" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Mon profil
                    </a>
                    <a routerLink="/rh/settings" (click)="showProfileMenu.set(false)" class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Paramètres
                    </a>
                    <div class="border-t border-gray-200 dark:border-dark-border my-1"></div>
                    <button (click)="auth.logout()" class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Déconnexion
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </header>

        <main class="flex-1 p-4 sm:p-6 lg:p-8">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
    }
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fadeIn {
      animation: fadeIn 0.2s ease-out;
    }
    .animate-slideIn {
      animation: slideIn 0.3s ease-out;
    }
    .animate-slideDown {
      animation: slideDown 0.2s ease-out;
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.75rem;
      border-radius: 0.875rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: rgb(55 65 81);
      transition: all 0.2s ease;
    }
    :host-context(.dark) .nav-link {
      color: rgb(148 163 184);
    }
    .nav-link:hover {
      background: rgb(249 250 251);
    }
    :host-context(.dark) .nav-link:hover {
      background: rgb(15 23 42);
    }
    .nav-link-active {
      background: linear-gradient(to right, rgb(79 70 229 / 0.1), rgb(6 182 212 / 0.08)) !important;
      color: rgb(79 70 229) !important;
      box-shadow: inset 3px 0 0 0 rgb(79 70 229);
    }
    :host-context(.dark) .nav-link-active {
      background: linear-gradient(to right, rgb(79 70 229 / 0.2), rgb(6 182 212 / 0.12)) !important;
      color: rgb(165 180 252) !important;
    }
    .nav-icon-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 0.625rem;
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }
    .nav-link:hover .nav-icon-wrap {
      transform: scale(1.08);
    }
    .nav-link-active .nav-icon-wrap {
      transform: scale(1.05);
    }
    .nav-link-active .nav-desc {
      color: rgb(79 70 229 / 0.75);
    }
    :host-context(.dark) .nav-link-active .nav-desc {
      color: rgb(165 180 252 / 0.8);
    }
  `]
})
export class RhLayoutComponent {
  protected readonly auth = inject(AuthService);
  protected readonly theme = inject(ThemeService);
  protected readonly sidebarOpen = signal(false);
  protected readonly pageTitle = signal('Tableau de bord');
  protected readonly showNotifications = signal(false);
  protected readonly showProfileMenu = signal(false);
  protected readonly notifications = signal<Notification[]>([
    {
      id: 1,
      title: 'Nouvelle évaluation',
      message: 'Une nouvelle évaluation de performance vous a été assignée',
      time: new Date(),
      read: false,
      type: 'info'
    },
    {
      id: 2,
      title: 'Objectif atteint',
      message: 'Votre équipe a atteint 90% des objectifs trimestriels',
      time: new Date(Date.now() - 3600000),
      read: false,
      type: 'success'
    }
  ]);

  protected readonly unreadCount = computed(() => 
    this.notifications().filter(n => !n.read).length
  );

  protected readonly navItems = [
    {
      id: 'dashboard',
      path: '/rh/dashboard',
      label: 'Tableau de bord',
      description: 'Vue d\'ensemble et statistiques',
      iconBg: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300',
    },
    {
      id: 'employees',
      path: '/rh/employees',
      label: 'Employés',
      description: 'Gérer les profils et CV',
      iconBg: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-300',
    },
    {
      id: 'evaluations',
      path: '/rh/evaluations',
      label: 'Évaluations',
      description: 'Tests IA et résultats',
      iconBg: 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300',
    },
    {
      id: 'profile',
      path: '/rh/profile',
      label: 'Mon profil',
      description: 'Compte et paramètres',
      iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300',
    },
  ];

  toggleNotifications() {
    this.showNotifications.update(v => !v);
    if (this.showProfileMenu()) {
      this.showProfileMenu.set(false);
    }
  }

  toggleProfileMenu() {
    this.showProfileMenu.update(v => !v);
    if (this.showNotifications()) {
      this.showNotifications.set(false);
    }
  }

  markAsRead(id: number) {
    this.notifications.update(notifs =>
      notifs.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  markAllAsRead() {
    this.notifications.update(notifs =>
      notifs.map(n => ({ ...n, read: true }))
    );
  }

  formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours} h`;
    if (days === 1) return 'Hier';
    return `Il y a ${days} jours`;
  }
}