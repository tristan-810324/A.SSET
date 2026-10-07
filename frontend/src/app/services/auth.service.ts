import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, timeout } from 'rxjs';
import { environment } from '../../environments/environment';

export type OtpType = 'VERIFY_ACCOUNT' | 'RESET_PASSWORD';

export interface AuthUser {
  id: string;
  email: string;
  role: 'FACULTY' | 'CUSTODIAN' | 'ADMIN';
  status: 'PENDING_PROFILE' | 'PENDING_APPROVAL' | 'ACTIVE' | 'DEACTIVATED';
  isVerified: boolean;
  fullName?: string | null;
  department?: string | null;
  designation?: string | null;
}

const normalizeRole = (role: unknown): AuthUser['role'] | null => {
  if (typeof role !== 'string') return null;
  const normalized = role.trim().toUpperCase();
  return normalized === 'ADMIN' || normalized === 'FACULTY' || normalized === 'CUSTODIAN'
    ? normalized
    : null;
};

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface MessageResponse {
  message: string;
}

export const getAuthErrorMessage = (
  error: { name?: string; status?: number; error?: { message?: string } } | null | undefined,
  fallback: string,
): string => {
  if (error?.name === 'TimeoutError') return 'The server took too long to respond. Please try again in a moment.';
  if (error?.status === 0) return 'The A.SSET server is unreachable. Start the backend with "npm run dev" inside the backend folder, then try again.';
  if (error?.status === 401) return 'The email or password is incorrect. Please check your details and try again.';
  if (error?.status === 403) return error.error?.message ?? 'Your account is not ready for this action yet.';
  if (error?.status === 409) return error.error?.message ?? 'An account with this email already exists. Try signing in instead.';
  if (error?.status === 503) return error.error?.message ?? 'The verification email could not be sent. Please try again in a moment.';
  return error?.error?.message ?? fallback;
};

export interface OtpVerificationResponse extends MessageResponse {
  token?: string;
  status?: AuthUser['status'];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authUrl = `${environment.apiUrl}/auth`;

  register(email: string, password: string, confirmPassword: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.authUrl}/register`, {
      email,
      password,
      confirmPassword,
    }).pipe(timeout(10000));
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.authUrl}/login`, { email, password })
      .pipe(timeout(10000));
  }

  verifyOtp(email: string, code: string, type: OtpType): Observable<OtpVerificationResponse> {
    return this.http.post<OtpVerificationResponse>(`${this.authUrl}/verify-otp`, { email, code, type }).pipe(timeout(10000));
  }

  resendOtp(email: string, type: OtpType): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.authUrl}/resend-otp`, { email, type }).pipe(timeout(10000));
  }

  requestPasswordReset(email: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.authUrl}/request-password-reset`, { email }).pipe(timeout(10000));
  }

  setupProfile(data: { fullName: string; department: string; designation: string }): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.authUrl}/profile-setup`, data, {
      headers: { Authorization: `Bearer ${this.getToken() ?? ''}` },
    });
  }

  saveSession(response: LoginResponse | OtpVerificationResponse): void {
    if (response.token) localStorage.setItem('asset_auth_token', response.token);
  }

  saveLoginSession(response: LoginResponse): void {
    this.saveSession(response);
    const role = normalizeRole(response.user?.role);
    if (!role) {
      this.logout();
      return;
    }
    localStorage.setItem('asset_auth_user', JSON.stringify({ ...response.user, role }));
  }

  saveUser(user: AuthUser): void {
    localStorage.setItem('asset_auth_user', JSON.stringify(user));
  }

  getUser(): AuthUser | null {
    const value = localStorage.getItem('asset_auth_user');
    if (!value) return null;
    try {
      const user = JSON.parse(value) as Partial<AuthUser>;
      const role = normalizeRole(user.role);
      if (!role || typeof user.id !== 'string' || typeof user.email !== 'string') {
        this.logout();
        return null;
      }
      return { ...user, role } as AuthUser;
    } catch {
      this.logout();
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('asset_auth_token');
  }

  logout(): void {
    localStorage.removeItem('asset_auth_token');
    localStorage.removeItem('asset_auth_user');
  }

  private authHeaders() {
    return { Authorization: `Bearer ${this.getToken() ?? ''}` };
  }
}
