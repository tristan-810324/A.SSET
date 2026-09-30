import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

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
  protected code = '';
  protected verified = false;
  protected resent = false;

  protected verifyCode(): void {
    this.verified = true;
  }

  protected resendCode(): void {
    this.resent = true;
  }

  protected continueAfterVerification(): void {
    this.router.navigate(['/login']);
  }
}
