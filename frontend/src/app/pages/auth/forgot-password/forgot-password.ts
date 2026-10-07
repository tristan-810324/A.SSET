import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, getAuthErrorMessage } from '../../../services/auth.service';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
  protected submitted = false;
  protected loading = false;
  protected email = '';
  protected errorMessage = '';

  constructor(private readonly router: Router, private readonly auth: AuthService) {}

  protected sendReset(): void {
    this.errorMessage = '';
    this.submitted = false;
    this.loading = true;
    this.auth.requestPasswordReset(this.email).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/verify-otp'], { queryParams: { email: this.email, flow: 'reset' } });
      },
      error: (error: { error?: { message?: string } }) => {
        this.loading = false;
        this.errorMessage = getAuthErrorMessage(error, 'We could not send the reset code. Please check your email and try again.');
      },
    });
  }
}
