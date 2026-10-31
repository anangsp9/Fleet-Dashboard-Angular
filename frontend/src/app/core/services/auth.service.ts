import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<User | null>(null);
  private token = signal<string | null>(null);
  private apiUrl = 'http://localhost:3000/api/auth';

  user = this.currentUser.asReadonly();
  isAuthenticated = computed(() => !!this.token());

  constructor(private http: HttpClient, private router: Router) {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    if (savedToken && savedUser) {
      this.token.set(savedToken);
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.http.post<{ user: User; token: string }>(`${this.apiUrl}/login`, { email, password })
        .subscribe({
          next: (response) => {
            this.currentUser.set(response.user);
            this.token.set(response.token);
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('auth_user', JSON.stringify(response.user));
            resolve(true);
          },
          error: (error) => {
            console.error('Login failed:', error.error?.error || 'Server unavailable');
            resolve(false);
          },
        });
    });
  }

  logout(): void {
    this.currentUser.set(null);
    this.token.set(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this.token();
  }
}
