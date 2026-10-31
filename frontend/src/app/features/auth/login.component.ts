import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4 overflow-hidden relative">
      <!-- Decorative background elements -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
      
      <div class="w-full max-w-md relative z-10">
        <!-- Header with logo and branding -->
        <div class="text-center mb-12">
          <!-- Logo -->
          <div class="mb-6 flex justify-center">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl blur-lg opacity-30"></div>
              <div class="relative w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Brand name and tagline -->
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">FleetHub</h1>
          <p class="text-gray-600 dark:text-gray-400 font-medium">Enterprise Fleet Management</p>
          <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">Real-time tracking and logistics optimization</p>
        </div>

        <!-- Login card with professional styling -->
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden">
          <!-- Card header with accent line -->
          <div class="h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
          
          <div class="p-8">
            <!-- Sign in heading -->
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Sign in</h2>
              <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">Access your fleet management dashboard</p>
            </div>

            <!-- Error message -->
            @if (error) {
              <div class="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl flex items-start gap-3">
                <svg class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-red-700 dark:text-red-400 text-sm font-medium">{{ error }}</p>
              </div>
            }

            <!-- Login form -->
            <form (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- Email field -->
              <div>
                <label for="email" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <div class="relative">
                  <div class="absolute left-0 top-0 h-full w-10 flex items-center justify-center text-gray-400 dark:text-gray-500 pointer-events-none">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <input 
                    id="email"
                    type="email" 
                    [(ngModel)]="email" 
                    name="email"
                    placeholder="admin@fleet.com"
                    class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-0 dark:focus:ring-offset-0 focus:border-transparent"
                  />
                </div>
              </div>

              <!-- Password field -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label for="password" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
                  <a href="#" class="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 text-xs font-medium transition-colors">Forgot password?</a>
                </div>
                <div class="relative">
                  <div class="absolute left-0 top-0 h-full w-10 flex items-center justify-center text-gray-400 dark:text-gray-500 pointer-events-none">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </div>
                  <input 
                    id="password"
                    type="password" 
                    [(ngModel)]="password" 
                    name="password"
                    placeholder="••••••••"
                    class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-0 dark:focus:ring-offset-0 focus:border-transparent"
                  />
                </div>
              </div>

              <!-- Remember me -->
              <div class="flex items-center">
                <input 
                  id="remember" 
                  type="checkbox" 
                  class="w-4 h-4 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded accent-amber-600 cursor-pointer transition-colors"
                />
                <label for="remember" class="ml-2.5 text-sm text-gray-600 dark:text-gray-400 font-medium cursor-pointer">Remember me</label>
              </div>

              <!-- Sign in button -->
              <button 
                type="submit"
                [disabled]="loading"
                class="w-full mt-8 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:from-amber-700 active:to-amber-800 dark:from-amber-600 dark:to-amber-700 dark:hover:from-amber-700 dark:hover:to-amber-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
              >
                @if (loading) {
                  <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                } @else {
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  <span>Sign in</span>
                }
              </button>
            </form>

            <!-- Divider -->
            <div class="relative my-8">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">Demo Credentials</span>
              </div>
            </div>

            <!-- Demo credentials info -->
            <div class="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl">
              <div class="flex gap-3">
                <div class="flex-shrink-0">
                  <svg class="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div class="text-sm">
                  <p class="font-semibold text-amber-900 dark:text-amber-200">Test Account</p>
                  <p class="text-amber-800 dark:text-amber-300 text-xs mt-1">
                    <code class="font-mono bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-600">admin&#64;fleet.com</code> / <code class="font-mono bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-600">admin123</code>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Card footer with security badge -->
          <div class="px-8 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2">
            <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            <p class="text-xs text-gray-600 dark:text-gray-400 font-medium">Secure encrypted connection</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-8 text-center">
          <p class="text-xs text-gray-600 dark:text-gray-400">
            <span class="font-medium text-gray-700 dark:text-gray-300">Need help?</span>
            <a href="#" class="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium ml-1 transition-colors">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  email = 'admin@fleet.com';
  password = 'admin123';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit(): Promise<void> {
    this.loading = true;
    this.error = '';

    const success = await this.authService.login(this.email, this.password);
    if (success) {
      this.router.navigate(['/dashboard']);
    } else {
      this.error = 'Invalid email or password';
    }
    this.loading = false;
  }
}
