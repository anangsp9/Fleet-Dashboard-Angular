import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { DataService } from '../../core/services/data.service';
import { DashboardStats, Trip, Alert } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatCardComponent],
  template: `
    <div class="space-y-8">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
          <p class="text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Real-time fleet operations overview
          </p>
        </div>
        <button (click)="refreshData()" 
                class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:from-amber-700 active:to-amber-800 dark:from-amber-600 dark:to-amber-700 dark:hover:from-amber-700 dark:hover:to-amber-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 w-fit">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Refresh Data
        </button>
      </div>

      <!-- KPI Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <app-stat-card
          label="Total Vehicles"
          [value]="stats().totalVehicles"
          bgColorClass="bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700"
          [trend]="5.2"
          [icon]="vehicleIcon"/>
        <app-stat-card
          label="Active Trips"
          [value]="stats().activeTrips"
          bgColorClass="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700"
          [trend]="12.8"
          [icon]="tripIcon"/>
        <app-stat-card
          label="Available Drivers"
          [value]="stats().availableDrivers"
          bgColorClass="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700"
          [trend]="-2.1"
          [icon]="driverIcon"/>
        <app-stat-card
          label="Active Alerts"
          [value]="stats().alertsCount"
          bgColorClass="bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700"
          [icon]="alertIcon"/>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Active Trips Section -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-lg dark:shadow-xl backdrop-blur-sm">
            <!-- Header with gradient accent -->
            <div class="h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
            
            <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">Active Trips</h2>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ activeTrips().length }} ongoing deliveries</p>
              </div>
              <a routerLink="/trips" class="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold text-sm transition-colors">
                View All
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </a>
            </div>

            <div class="p-6">
              @if (activeTrips().length === 0) {
                <div class="text-center py-12">
                  <svg class="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <p class="text-gray-600 dark:text-gray-400 font-medium">No active trips at the moment</p>
                </div>
              } @else {
                <div class="space-y-3 max-h-96 overflow-y-auto">
                  @for (trip of activeTrips(); track trip.id) {
                    <div class="p-4 bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:shadow-md dark:hover:shadow-lg transition-all duration-200 group">
                      <div class="flex items-center justify-between gap-4">
                        <div class="flex items-center gap-4 min-w-0">
                          <!-- Status Icon -->
                          <div class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                               [ngClass]="trip.status === 'delayed' ? 'bg-red-100 dark:bg-red-500/20' : 'bg-green-100 dark:bg-green-500/20'">
                            <svg class="w-6 h-6" [ngClass]="trip.status === 'delayed' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                            </svg>
                          </div>
                          
                          <!-- Trip Info -->
                          <div class="min-w-0 flex-1">
                            <p class="text-gray-900 dark:text-white font-semibold text-sm">{{ trip.origin }} <span class="text-gray-600 dark:text-gray-400">→</span> {{ trip.destination }}</p>
                            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              <span class="font-mono">{{ getVehiclePlate(trip.vehicleId) }}</span>
                              <span class="text-gray-400 dark:text-gray-600 mx-1">•</span>
                              <span>{{ trip.distance }}km</span>
                            </p>
                          </div>
                        </div>

                        <!-- Status and ETA -->
                        <div class="flex-shrink-0 text-right">
                          <span class="inline-flex px-3 py-1.5 rounded-full text-xs font-semibold"
                                [ngClass]="{
                                  'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400': trip.status === 'in-transit',
                                  'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400': trip.status === 'delayed',
                                  'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-600': trip.status === 'pending',
                                  'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300': trip.status === 'completed'
                                }">
                            {{ trip.status | titlecase }}
                          </span>
                          @if (trip.eta) {
                            <p class="text-xs text-gray-600 dark:text-gray-400 font-medium mt-2">ETA: {{ formatTime(trip.eta) }}</p>
                          }
                        </div>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Alerts & Fleet Status Section -->
        <div class="space-y-6">
          <!-- Recent Alerts -->
          <div class="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-lg dark:shadow-xl backdrop-blur-sm">
            <div class="h-1 bg-gradient-to-r from-red-400 to-red-600"></div>
            
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Recent Alerts</h3>
                @if (stats().alertsCount > 0) {
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 text-xs font-bold rounded-full">
                    <span class="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full animate-pulse"></span>
                    {{ stats().alertsCount }} active
                  </span>
                }
              </div>
            </div>

            <div class="p-6">
              @if (dashboardStats()) {
                <div class="space-y-4">
                  <div class="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-500/10 dark:to-amber-600/5 border border-amber-200 dark:border-amber-500/30 rounded-xl">
                    <h4 class="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-3">Fleet Status Overview</h4>
                    <div class="grid grid-cols-2 gap-3">
                      <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-amber-200 dark:border-amber-500/20">
                        <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats().activeVehicles }}</p>
                        <p class="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">Active</p>
                      </div>
                      <div class="bg-white dark:bg-gray-800 rounded-lg p-3 border border-amber-200 dark:border-amber-500/20">
                        <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ stats().totalVehicles - stats().activeVehicles }}</p>
                        <p class="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1">Inactive</p>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-lg dark:shadow-xl backdrop-blur-sm">
            <div class="h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Quick Metrics</h3>
            </div>

            <div class="p-6">
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <div>
                    <p class="text-xs text-gray-600 dark:text-gray-400 font-medium">Avg Efficiency</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stats().avgEfficiency }}<span class="text-sm font-normal text-gray-600 dark:text-gray-400">%</span></p>
                  </div>
                  <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                </div>

                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <div>
                    <p class="text-xs text-gray-600 dark:text-gray-400 font-medium">Completed Trips</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stats().completedTrips }}</p>
                  </div>
                  <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>

                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <div>
                    <p class="text-xs text-gray-600 dark:text-gray-400 font-medium">Delayed Trips</p>
                    <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stats().delayedTrips }}</p>
                  </div>
                  <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Fleet Performance Section -->
      <div class="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-lg dark:shadow-xl backdrop-blur-sm">
        <div class="h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
        
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Fleet Performance</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Vehicle utilization and status distribution</p>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Active Status Progress -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Active Vehicles</span>
                <span class="text-sm font-bold text-gray-900 dark:text-white">{{ activePercent() | number:'1.0-0' }}%</span>
              </div>
              <div class="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500" [style.width.%]="activePercent()"></div>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-2">{{ stats().activeVehicles }} of {{ stats().totalVehicles }} vehicles</p>
            </div>

            <!-- Total Fleet Progress -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Fleet</span>
                <span class="text-sm font-bold text-gray-900 dark:text-white">100%</span>
              </div>
              <div class="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" style="width: 100%"></div>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-2">{{ stats().totalVehicles }} total vehicles</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  stats = signal<DashboardStats>({
    totalVehicles: 0, activeVehicles: 0, totalTrips: 0,
    activeTrips: 0, completedTrips: 0, delayedTrips: 0,
    totalDrivers: 0, availableDrivers: 0, alertsCount: 0, avgEfficiency: 0,
  });
  activeTrips = signal<Trip[]>([]);
  dashboardStats = signal<any>(null);

  vehicleIcon = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>';
  tripIcon = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>';
  driverIcon = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>';
  alertIcon = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void {
    this.dataService.fetchVehicles();
    this.dataService.fetchDrivers();
    this.dataService.fetchTrips();
    this.dataService.fetchDashboardStats();

    setTimeout(() => {
      this.loadStats();
    }, 1000);
  }

  private loadStats(): void {
    const statsFromApi = this.dataService.getDashboardStatsSignal()();
    if (statsFromApi) {
      this.stats.set(statsFromApi);
      this.dashboardStats.set(statsFromApi);
    } else {
      this.stats.set(this.dataService.getStats());
    }
    this.activeTrips.set(this.dataService.getActiveTrips());
  }

  getVehiclePlate(vehicleId: string): string {
    const vehicle = this.dataService.getVehicleById(vehicleId);
    return vehicle?.plate || 'Unknown';
  }

  formatTime(isoString: string): string {
    return new Date(isoString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }

  activePercent(): number {
    if (this.stats().totalVehicles === 0) return 0;
    return (this.stats().activeVehicles / this.stats().totalVehicles) * 100;
  }
}
