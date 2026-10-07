import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type { AuthUser } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly usersUrl = `${environment.apiUrl}/users`;

  pendingUsers(): Observable<AuthUser[]> {
    return this.http.get<AuthUser[]>(`${this.usersUrl}/pending`, { headers: this.headers() });
  }

  approve(userId: string): Observable<AuthUser> {
    return this.http.patch<AuthUser>(`${this.usersUrl}/${userId}/approve`, {}, { headers: this.headers() });
  }

  deactivate(userId: string): Observable<AuthUser> {
    return this.http.patch<AuthUser>(`${this.usersUrl}/${userId}/deactivate`, {}, { headers: this.headers() });
  }

  private headers() {
    const token = localStorage.getItem('asset_auth_token');
    return { Authorization: `Bearer ${token ?? ''}` };
  }
}
