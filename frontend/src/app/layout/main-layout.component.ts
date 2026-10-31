import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { DataService } from '../core/services/data.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
  template: `
    <div class="min-h-screen bg-white dark:bg-gray-900">
      <app-sidebar [isOpen]="sidebarOpen" (closeSidebar)="closeSidebar()"/>
      <div class="lg:ml-64 transition-all duration-300">
        <app-header [alertsCount]="alertsCount" [darkMode]="darkMode()" (toggleSidebar)="toggleSidebar()" (toggleDarkMode)="toggleDarkModeEvent()"/>
        <main class="p-4 md:p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class MainLayoutComponent implements OnInit {
  sidebarOpen = true;
  alertsCount = 0;
  darkMode = signal(false);

  constructor(private dataService: DataService) {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) this.darkMode.set(JSON.parse(saved));
    this.applyDarkMode();
  }

  ngOnInit(): void {
    this.dataService.fetchDashboardStats();
    setTimeout(() => {
      const stats = this.dataService.getDashboardStatsSignal()();
      if (stats) {
        this.alertsCount = stats.alertsCount;
      }
    }, 1000);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  toggleDarkModeEvent(): void {
    const newMode = !this.darkMode();
    this.darkMode.set(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    const doc = document.documentElement;
    if (newMode) {
      doc.classList.add('dark');
    } else {
      doc.classList.remove('dark');
    }
  }

  private applyDarkMode(): void {
    const doc = document.documentElement;
    if (this.darkMode()) {
      doc.classList.add('dark');
    } else {
      doc.classList.remove('dark');
    }
  }
}
