import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
  protected submitted = false;
  protected email = '';

  constructor(private readonly router: Router) {}

  protected sendReset(): void {
    this.submitted = true;
    this.router.navigate(['/verify-otp'], {
      queryParams: { email: this.email, flow: 'reset' },
    });
  }
}
