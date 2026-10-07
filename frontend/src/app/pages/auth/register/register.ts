import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService, getAuthErrorMessage } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',

})
export class Register {
  email: string = '';
  password = '';
  confirmPassword = '';
  submitted: boolean = false;
  loading = false;
  errorMessage = '';

  constructor(private readonly auth: AuthService, private readonly router: Router) {}

  registerAccount() {
    this.errorMessage = '';
    this.submitted = false;
    this.loading = true;
    this.auth.register(this.email, this.password, this.confirmPassword).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/verify-otp'], {
          queryParams: { email: this.email, flow: 'register', message: response.message },
        });
      },
      error: (error: { error?: { message?: string } }) => {
        this.loading = false;
        this.errorMessage = getAuthErrorMessage(error, 'We could not create your account. Please check your details and try again.');
      },
    });
  }

  signInWithGoogle() {
    this.errorMessage = 'Google sign-in is not available yet. Use your DYCI email and password.';
  }
}