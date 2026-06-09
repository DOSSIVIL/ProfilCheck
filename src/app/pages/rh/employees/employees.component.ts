import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { EmployeeService } from '../../../core/services/employee.service';
import { EmployeeProfile, ProfileRequest } from '../../../core/models/api.models';
import { extractApiError } from '../../../core/utils/api-error.util';

@Component({
  selector: 'app-rh-employees',
  imports: [FormsModule, DatePipe],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold dark:text-dark-text">Employés</h2>
          <p class="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
            Gérez les profils de vos collaborateurs
          </p>
        </div>
        <button (click)="openCreate()" class="btn-primary">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nouvel employé
        </button>
      </div>

      @if (error()) {
        <div class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {{ error() }}
        </div>
      }

      <!-- Search -->
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          [(ngModel)]="searchQuery"
          placeholder="Rechercher par nom, poste ou email..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-dark-text"
        />
      </div>

      @if (loading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          @for (i of [1,2,3]; track i) {
            <div class="card p-5 animate-pulse hover:translate-y-0">
              <div class="h-4 bg-gray-200 dark:bg-dark-border rounded w-3/4 mb-3"></div>
              <div class="h-3 bg-gray-200 dark:bg-dark-border rounded w-1/2 mb-2"></div>
              <div class="h-3 bg-gray-200 dark:bg-dark-border rounded w-2/3"></div>
            </div>
          }
        </div>
      } @else if (filteredEmployees().length === 0) {
        <div class="card p-12 text-center hover:translate-y-0">
          <svg class="w-16 h-16 mx-auto text-gray-300 dark:text-dark-border mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.21a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          <h3 class="text-lg font-semibold dark:text-dark-text mb-2">Aucun employé</h3>
          <p class="text-sm text-gray-500 dark:text-dark-text-secondary mb-4">Commencez par ajouter votre premier collaborateur</p>
          <button (click)="openCreate()" class="btn-primary">Ajouter un employé</button>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          @for (emp of filteredEmployees(); track emp.id) {
            <div class="card p-5 hover:translate-y-0 group">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center text-white font-bold text-sm">
                    {{ emp.fullName.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <h3 class="font-semibold dark:text-dark-text">{{ emp.fullName }}</h3>
                    <p class="text-sm text-gray-500 dark:text-dark-text-secondary">{{ emp.jobTitle }}</p>
                  </div>
                </div>
                <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button (click)="openEdit(emp)" class="p-1.5 rounded-lg hover:bg-primary/10 text-primary" title="Modifier">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </button>
                  <button (click)="confirmDelete(emp)" class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500" title="Supprimer">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
              @if (emp.email) {
                <p class="text-xs text-gray-500 dark:text-dark-text-secondary mb-2 truncate">{{ emp.email }}</p>
              }
              <div class="flex flex-wrap gap-2 mt-3">
                <span class="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{{ emp.experienceYears }} ans d'exp.</span>
                @if (emp.declaredSkills) {
                  <span class="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary truncate max-w-[150px]">{{ emp.declaredSkills }}</span>
                }
              </div>
              <p class="text-xs text-gray-400 dark:text-dark-text-secondary mt-3">Ajouté le {{ emp.createdAt | date:'dd/MM/yyyy' }}</p>
            </div>
          }
        </div>
      }

      <!-- Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" (click)="closeModal()">
          <div class="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
            <div class="p-6 border-b border-gray-200 dark:border-dark-border">
              <h3 class="text-lg font-semibold dark:text-dark-text">
                {{ editingId() ? 'Modifier l\'employé' : 'Nouvel employé' }}
              </h3>
            </div>
            <form class="p-6 space-y-4" (ngSubmit)="saveEmployee()">
              @if (formError()) {
                <div class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">{{ formError() }}</div>
              }
              <div>
                <label class="block text-sm font-medium mb-1.5 dark:text-dark-text">Nom complet *</label>
                <input type="text" [(ngModel)]="form.fullName" name="fullName" required
                  class="w-full rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary dark:text-dark-text" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5 dark:text-dark-text">Email</label>
                <input type="email" [(ngModel)]="form.email" name="email"
                  class="w-full rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary dark:text-dark-text" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5 dark:text-dark-text">Poste *</label>
                <input type="text" [(ngModel)]="form.jobTitle" name="jobTitle" required
                  class="w-full rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary dark:text-dark-text" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5 dark:text-dark-text">Années d'expérience *</label>
                <input type="number" [(ngModel)]="form.experienceYears" name="experienceYears" min="0" max="60" required
                  class="w-full rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary dark:text-dark-text" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5 dark:text-dark-text">Compétences déclarées</label>
                <input type="text" [(ngModel)]="form.declaredSkills" name="declaredSkills"
                  placeholder="Java, Angular, SQL..."
                  class="w-full rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary dark:text-dark-text" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5 dark:text-dark-text">Bio</label>
                <textarea [(ngModel)]="form.bio" name="bio" rows="3"
                  class="w-full rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary dark:text-dark-text resize-none"></textarea>
              </div>
              <div class="flex gap-3 pt-2">
                <button type="button" (click)="closeModal()" class="btn-secondary flex-1">Annuler</button>
                <button type="submit" [disabled]="saving()" class="btn-primary flex-1 disabled:opacity-50">
                  @if (saving()) {
                    Enregistrement...
                  } @else if (editingId()) {
                    Mettre à jour
                  } @else {
                    Créer
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Delete confirmation -->
      @if (deletingEmployee()) {
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div class="bg-white dark:bg-dark-surface rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold dark:text-dark-text mb-2">Supprimer cet employé ?</h3>
            <p class="text-sm text-gray-500 dark:text-dark-text-secondary mb-6">
              {{ deletingEmployee()!.fullName }} sera définitivement supprimé.
            </p>
            <div class="flex gap-3">
              <button (click)="deletingEmployee.set(null)" class="btn-secondary flex-1">Annuler</button>
              <button (click)="deleteEmployee()" [disabled]="saving()" class="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 py-3 font-semibold transition-colors disabled:opacity-50">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class RhEmployeesComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);

  protected readonly employees = signal<EmployeeProfile[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly showModal = signal(false);
  protected readonly editingId = signal<number | null>(null);
  protected readonly saving = signal(false);
  protected readonly formError = signal('');
  protected readonly deletingEmployee = signal<EmployeeProfile | null>(null);

  searchQuery = '';
  form: ProfileRequest = this.emptyForm();

  ngOnInit(): void {
    this.loadEmployees();
  }

  filteredEmployees(): EmployeeProfile[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.employees();
    return this.employees().filter(
      (e) =>
        e.fullName.toLowerCase().includes(q) ||
        e.jobTitle.toLowerCase().includes(q) ||
        (e.email?.toLowerCase().includes(q) ?? false)
    );
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form = this.emptyForm();
    this.formError.set('');
    this.showModal.set(true);
  }

  openEdit(emp: EmployeeProfile): void {
    this.editingId.set(emp.id);
    this.form = {
      fullName: emp.fullName,
      email: emp.email ?? '',
      jobTitle: emp.jobTitle,
      experienceYears: emp.experienceYears,
      declaredSkills: emp.declaredSkills ?? '',
      bio: emp.bio ?? '',
    };
    this.formError.set('');
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingId.set(null);
  }

  saveEmployee(): void {
    if (!this.form.fullName.trim() || !this.form.jobTitle.trim()) {
      this.formError.set('Le nom et le poste sont requis');
      return;
    }

    this.saving.set(true);
    this.formError.set('');

    const payload: ProfileRequest = {
      fullName: this.form.fullName.trim(),
      jobTitle: this.form.jobTitle.trim(),
      experienceYears: this.form.experienceYears,
      email: this.form.email?.trim() || undefined,
      declaredSkills: this.form.declaredSkills?.trim() || undefined,
      bio: this.form.bio?.trim() || undefined,
    };

    const id = this.editingId();
    const request$ = id
      ? this.employeeService.update(id, payload)
      : this.employeeService.create(payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeModal();
        this.loadEmployees();
      },
      error: (err) => {
        this.formError.set(extractApiError(err));
        this.saving.set(false);
      },
    });
  }

  confirmDelete(emp: EmployeeProfile): void {
    this.deletingEmployee.set(emp);
  }

  deleteEmployee(): void {
    const emp = this.deletingEmployee();
    if (!emp) return;

    this.saving.set(true);
    this.employeeService.delete(emp.id).subscribe({
      next: () => {
        this.saving.set(false);
        this.deletingEmployee.set(null);
        this.loadEmployees();
      },
      error: (err) => {
        this.error.set(extractApiError(err));
        this.saving.set(false);
        this.deletingEmployee.set(null);
      },
    });
  }

  private loadEmployees(): void {
    this.loading.set(true);
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.employees.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractApiError(err));
        this.loading.set(false);
      },
    });
  }

  private emptyForm(): ProfileRequest {
    return { fullName: '', email: '', jobTitle: '', experienceYears: 0, declaredSkills: '', bio: '' };
  }
}
