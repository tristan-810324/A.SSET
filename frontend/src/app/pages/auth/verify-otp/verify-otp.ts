import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService, getAuthErrorMessage, type OtpType } from '../../../services/auth.service';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.html',
})
export class VerifyOtp {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly flow = this.route.snapshot.queryParamMap.get('flow') === 'reset' ? 'reset' : 'register';
  protected readonly email = this.route.snapshot.queryParamMap.get('email') ?? '';
  protected readonly notice = this.route.snapshot.queryParamMap.get('message') ?? '';
  protected code = '';
  protected verified = false;
  protected resent = false;
  protected loading = false;
  protected resending = false;
  protected errorMessage = '';

  constructor(private readonly auth: AuthService) {}

  protected verifyCode(): void {
    this.errorMessage = '';
    this.loading = true;
    this.auth.verifyOtp(this.email, this.code, this.otpType).subscribe({
      next: (response) => {
        this.loading = false;
        this.verified = true;
        window.setTimeout(() => this.continueAfterVerification(), 1400);
      },
      error: (error: { error?: { message?: string } }) => {
        this.loading = false;
        this.errorMessage = getAuthErrorMessage(error, 'That code is not correct or has expired. Please request a new code and try again.');
      },
    });
  }

  protected resendCode(): void {
    this.errorMessage = '';
    this.resent = false;
    this.resending = true;
    this.auth.resendOtp(this.email, this.otpType).subscribe({
      next: () => {
        this.resending = false;
        this.resent = true;
      },
      error: (error: { error?: { message?: string } }) => {
        this.resending = false;
        this.errorMessage = getAuthErrorMessage(error, 'We could not send a new code. Please wait a moment and try again.');
      },
    });
  }

  private get otpType(): OtpType {
    return this.flow === 'reset' ? 'RESET_PASSWORD' : 'VERIFY_ACCOUNT';
  }

  protected continueAfterVerification(): void {
    if (this.flow === 'register') {
      this.router.navigate(['/login'], { queryParams: { verified: 'true', email: this.email } });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
