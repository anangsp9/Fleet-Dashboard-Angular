import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="h-16 bg-white dark:bg-gray-800 border-b border-neutral-200 dark:border-gray-700 flex items-center justify-between px-6 sticky top-0 z-20">
      <div class="flex items-center gap-4">
        <button (click)="toggleSidebar.emit()"
                class="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-700 text-neutral-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors lg:hidden">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <div class="relative hidden md:block">
          <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input type="text" placeholder="Search vehicles, trips, drivers..."
                 class="w-80 pl-10 pr-4 py-2 bg-neutral-50 dark:bg-gray-700 border border-neutral-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-neutral-500 dark:placeholder-gray-400 text-sm focus:outline-none focus:border-amber-500 dark:focus:border-amber-500"/>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <button class="relative p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-700 text-neutral-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          @if (alertsCount() > 0) {
            <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {{ alertsCount() }}
            </span>
          }
        </button>

        <button (click)="onToggleDarkMode()"
                class="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-700 text-neutral-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          @if (darkMode()) {
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.64 15.95c-.978-1.465-2.427-2.909-4.213-4.695-1.786-1.786-3.23-3.235-4.695-4.213-.529-.352-1.117.035-1.117.666v2.289a2 2 0 01-2 2H8.62a2 2 0 01-2-2V6.666c0-.63-.314-1.018-.666-1.117-1.465.978-2.909 2.427-4.695 4.213C1.17 11.07.72 12.514.72 13.98c0 3.289 2.692 5.982 5.98 5.982 1.465 0 2.909-.45 4.695-2.236 1.786-1.786 3.235-3.23 4.213-4.695.352-.529-.035-1.117-.666-1.117h-2.289a2 2 0 01-2-2V8.62a2 2 0 012-2h2.289c.63 0 1.018-.314 1.117-.666z"/>
            </svg>
          } @else {
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1m-16 0H1m15.364 1.636l.707.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          }
        </button>

        <div class="flex items-center gap-3 pl-4 border-l border-neutral-200 dark:border-gray-700">
           <div class="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
             <span class="text-white text-sm font-medium">A</span>
           </div>
           <div class="hidden sm:block">
             <p class="text-gray-900 dark:text-white text-sm font-medium">Admin</p>
           </div>
           <button (click)="logout()"
                   class="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-700 text-neutral-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  alertsCount = input<number>(0);
  darkMode = input<boolean>(false);
  toggleSidebar = output<void>();
  toggleDarkMode = output<void>();

  constructor(private authService: AuthService, private router: Router) {}

  onToggleDarkMode(): void {
    this.toggleDarkMode.emit();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
