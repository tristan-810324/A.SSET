import { Routes } from '@angular/router';
import { Hero } from './pages/hero/hero';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { ForgotPassword } from './pages/auth/forgot-password/forgot-password';
import { VerifyOtp } from './pages/auth/verify-otp/verify-otp';
import { ProfileSetup } from './pages/auth/profile-setup/profile-setup';
import { PendingApproval } from './pages/auth/pending-approval/pending-approval';
import { AdminDashboard } from './pages/dashboards/admin/admin';
import { FacultyDashboard } from './pages/dashboards/faculty/faculty';
import { CustodianDashboard } from './pages/dashboards/custodian/custodian';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: Hero },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'verify-otp', component: VerifyOtp },
  { path: 'profile-setup', component: ProfileSetup, canActivate: [authGuard] },
  { path: 'pending-approval', component: PendingApproval, canActivate: [authGuard] },
  {
    path: 'dashboard/admin',
    component: AdminDashboard,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'dashboard/faculty',
    component: FacultyDashboard,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['FACULTY'] },
  },
  {
    path: 'dashboard/custodian',
    component: CustodianDashboard,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['CUSTODIAN'] },
  },
  { path: '**', redirectTo: '' },
];
