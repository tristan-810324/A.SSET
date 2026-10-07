import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService, getAuthErrorMessage } from '../../../services/auth.service';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-login',
  templateUrl: './login.html',
})
export class Login {
  protected submitted = false;
  protected loading = false;
  protected email = '';
  protected password = '';
  protected errorMessage = '';
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly changeDetector = inject(ChangeDetectorRef);

  protected signIn(): void {
    this.errorMessage = '';
    this.submitted = false;
    this.loading = true;
    this.auth.login(this.email, this.password).pipe(
      finalize(() => {
        this.loading = false;
        this.changeDetector.detectChanges();
      }),
    ).subscribe({
      next: (response) => {
        this.auth.saveLoginSession(response);
        const user = this.auth.getUser();
        if (!user) {
          this.errorMessage = 'Login succeeded, but the account role was not recognized. Please contact an administrator.';
          return;
        }
        this.submitted = true;
        const destination = user.status === 'PENDING_PROFILE'
          ? '/profile-setup'
          : user.status === 'PENDING_APPROVAL'
            ? '/pending-approval'
            : user.role === 'ADMIN'
          ? '/dashboard/admin'
          : user.role === 'CUSTODIAN'
            ? '/dashboard/custodian'
            : '/dashboard/faculty';
        void this.router.navigate([destination]);
      },
      error: (error: { error?: { message?: string }; name?: string }) => {
        this.errorMessage = error.name === 'TimeoutError'
          ? 'The server took too long to respond. Please make sure the backend is running, then try again.'
          : getAuthErrorMessage(error, 'We could not sign you in. Please try again.');
        this.changeDetector.detectChanges();
      },
    });
  }

  protected signInWithGoogle(): void {
    this.errorMessage = 'Google sign-in is not available yet. Use your DYCI email and password.';
  }
}
