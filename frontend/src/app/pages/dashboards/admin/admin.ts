import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import type { AuthUser } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin.html',
})
export class AdminDashboard {
  protected users: AuthUser[] = [];
  protected loading = true;
  protected errorMessage = '';
  private readonly usersApi = inject(UserService);
  private readonly router = inject(Router);

  constructor() {
    this.loadUsers();
  }

  protected loadUsers(): void {
    this.loading = true;
    this.usersApi.pendingUsers().subscribe({
      next: (users) => { this.users = users; this.loading = false; },
      error: (error: { error?: { message?: string } }) => {
        this.loading = false;
        this.errorMessage = error.error?.message ?? 'Unable to load pending users.';
      },
    });
  }

  protected approve(user: AuthUser): void {
    this.errorMessage = '';
    this.usersApi.approve(user.id).subscribe({
      next: () => this.loadUsers(),
      error: (error: { error?: { message?: string } }) => {
        this.errorMessage = error.error?.message ?? 'Unable to activate this account.';
      },
    });
  }

  protected deactivate(user: AuthUser): void {
    this.errorMessage = '';
    this.usersApi.deactivate(user.id).subscribe({
      next: () => this.loadUsers(),
      error: (error: { error?: { message?: string } }) => {
        this.errorMessage = error.error?.message ?? 'Unable to deactivate this account.';
      },
    });
  }

  protected logout(): void {
    localStorage.removeItem('asset_auth_token');
    localStorage.removeItem('asset_auth_user');
    this.router.navigate(['/login']);
  }
}
