import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login.component';
import { RegisterComponent } from './pages/auth/register.component';
import { RhLayoutComponent } from './pages/rh/layout/rh-layout.component';
import { RhDashboardComponent } from './pages/rh/dashboard/dashboard.component';
import { RhEmployeesComponent } from './pages/rh/employees/employees.component';
import { RhEvaluationsComponent } from './pages/rh/evaluations/evaluations.component';
import { EvaluationTakeComponent } from './pages/rh/evaluations/evaluation-take.component';
import { RhProfileComponent } from './pages/rh/profile/profile.component';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  {
    path: 'rh',
    component: RhLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: RhDashboardComponent },
      { path: 'employees', component: RhEmployeesComponent },
      { path: 'evaluations', component: RhEvaluationsComponent },
      { path: 'evaluations/conduire/:testId', component: EvaluationTakeComponent },
      { path: 'profile', component: RhProfileComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
