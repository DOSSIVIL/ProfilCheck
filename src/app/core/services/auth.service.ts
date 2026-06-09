import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, tap, catchError, throwError, switchMap, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  User,
} from '../models/api.models';

const TOKEN_KEY = 'profilcheck_token';
const USER_KEY = 'profilcheck_user';
const DASHBOARD_URL = '/rh/dashboard';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly tokenSignal = signal<string | null>(this.loadToken());
  private readonly currentUserSignal = signal<User | null>(this.loadUser());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenSignal() && !!this.currentUserSignal());

  login(credentials: LoginRequest): Observable<User> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(switchMap((res) => this.completeAuthFlow(res)));
  }

  register(data: RegisterRequest): Observable<User> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, data)
      .pipe(switchMap((res) => this.completeAuthFlow(res)));
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/auth/me`).pipe(
      tap((user) => this.saveUser(user)),
      catchError((err) => {
        this.clearSession();
        return throwError(() => err);
      })
    );
  }

  updateProfile(data: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/users/me`, data).pipe(
      tap((user) => this.saveUser(user))
    );
  }

  logout(): void {
    this.clearSession();
    this.router.navigateByUrl('/login');
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  initSession(): Observable<User | null> {
    if (!this.getToken()) {
      return of(null);
    }

    if (this.currentUserSignal()) {
      return of(this.currentUserSignal());
    }

    return this.getMe().pipe(catchError(() => of(null)));
  }

  ensureSession(): Observable<User> {
    const user = this.currentUserSignal();
    if (user) {
      return of(user);
    }

    if (!this.getToken()) {
      return throwError(() => new Error('Session expirée'));
    }

    return this.getMe();
  }

  private completeAuthFlow(res: AuthResponse): Observable<User> {
    this.persistAuthResponse(res);

    const user$ = res.user ? of(res.user) : this.getMe();

    return user$.pipe(
      tap(() => {
        this.router.navigateByUrl(DASHBOARD_URL, { replaceUrl: true });
      })
    );
  }

  private persistAuthResponse(res: AuthResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(TOKEN_KEY, res.token);
    }
    this.tokenSignal.set(res.token);

    if (res.user) {
      this.saveUser(res.user);
    }
  }

  private saveUser(user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    this.currentUserSignal.set(user);
  }

  private clearSession(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
  }

  private loadToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  private loadUser(): User | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
