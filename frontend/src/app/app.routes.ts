import { Routes } from '@angular/router';
import { Hero } from './pages/hero/hero';
import { About } from './pages/about/about';
import { Contact } from './pages/contact/contact';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { ForgotPassword } from './pages/auth/forgot-password/forgot-password';

export const routes: Routes = [
  { path: '', component: Hero },
  { path: 'about', component: About },
  { path: 'contact', component: Contact },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: '**', redirectTo: '' },
];
