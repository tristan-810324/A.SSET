import { Routes } from '@angular/router';
import { Hero } from './pages/hero/hero';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { ForgotPassword } from './pages/auth/forgot-password/forgot-password';
import { VerifyOtp } from './pages/auth/verify-otp/verify-otp';

export const routes: Routes = [
  { path: '', component: Hero },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'verify-otp', component: VerifyOtp },
  { path: '**', redirectTo: '' },
];
