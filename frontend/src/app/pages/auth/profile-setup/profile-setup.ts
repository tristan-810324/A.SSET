import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, getAuthErrorMessage } from '../../../services/auth.service';

@Component({
  selector: 'app-profile-setup',
  imports: [FormsModule, RouterLink],
  templateUrl: './profile-setup.html',
})
export class ProfileSetup {
  protected fullName = '';
  protected department = '';
  protected designation = '';
  protected loading = false;
  protected errorMessage = '';

  protected readonly departments = [
    'College of Information Technology',
    'College of Education',
    'Senior High School Department',
    "Registrar's Office",
    'Guidance & Student Affairs Office',
    'Physical Plant & Facilities Operations',
  ];
  protected readonly designations = [
    'Dean / Principal',
    'Program Chair / Coordinator',
    'Administrative Office Head',
    'Regular Faculty / Class Adviser',
  ];

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected submit(): void {
    this.errorMessage = '';
    this.loading = true;
    this.auth.setupProfile({
      fullName: this.fullName,
      department: this.department,
      designation: this.designation,
    }).subscribe({
      next: (user) => {
        this.auth.saveUser(user);
        this.loading = false;
        this.router.navigate(['/pending-approval']);
      },
      error: (error: { error?: { message?: string } }) => {
        this.loading = false;
        this.errorMessage = getAuthErrorMessage(error, 'We could not save your profile. Please review the form and try again.');
      },
    });
  }
}
