import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Backdrop overlay untuk mobile -->
    @if (isOpen()) {
      <div class="fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity duration-300"
           (click)="closeSidebar.emit()"></div>
    }

    <!-- Sidebar -->
    <aside class="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-neutral-200 dark:border-gray-700 flex flex-col z-30 transition-transform duration-300 lg:translate-x-0"
           [class.-translate-x-full]="!isOpen()">
      <!-- Header dengan logo -->
      <div class="p-6 border-b border-neutral-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/30">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
          </div>
          <div>
            <h1 class="text-gray-900 dark:text-white font-bold text-lg">FleetHub</h1>
            <p class="text-neutral-600 dark:text-gray-400 text-xs">Logistics Platform</p>
          </div>
        </div>
      </div>

      <!-- Navigation menu -->
      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        @for (item of menuItems; track item.path) {
          <a [routerLink]="item.path"
             routerLinkActive="bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400"
             (click)="closeSidebar.emit()"
             class="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-600 dark:text-gray-400 hover:bg-neutral-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
            <span [innerHTML]="item.icon" class="w-5 h-5 flex-shrink-0"></span>
            <span class="text-sm font-medium">{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- User profile footer -->
      <div class="p-4 border-t border-neutral-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-white text-sm font-semibold">A</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-gray-900 dark:text-white text-sm font-semibold truncate">Admin</p>
            <p class="text-neutral-600 dark:text-gray-400 text-xs truncate">admin&#64;fleet.com</p>
          </div>
        </div>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  isOpen = input.required<boolean>();
  closeSidebar = output<void>();

  menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>',
    },
    {
      path: '/fleet',
      label: 'Fleet Management',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>',
    },
    {
      path: '/tracking',
      label: 'Live Tracking',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    },
    {
      path: '/trips',
      label: 'Trips',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>',
    },
    {
      path: '/telemetry',
      label: 'Telemetry',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>',
    },
    {
      path: '/reports',
      label: 'Reports',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
    },
  ];
}
