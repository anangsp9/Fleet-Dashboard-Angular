import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { DashboardStats } from '../../core/models';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
           <p class="text-neutral-600 dark:text-gray-400 mt-1">Performance metrics and operational insights</p>
        </div>
        <button (click)="refreshData()" class="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 w-fit">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Refresh
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-xl p-5">
          <p class="text-neutral-600 dark:text-gray-400 text-sm font-medium">Total Vehicles</p>
          <p class="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">{{ stats().totalVehicles }}</p>
          <p class="text-green-600 dark:text-green-400 text-xs mt-2 font-medium">{{ stats().activeVehicles }} active</p>
        </div>
        <div class="bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-xl p-5">
          <p class="text-neutral-600 dark:text-gray-400 text-sm font-medium">Total Trips</p>
          <p class="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{{ stats().totalTrips }}</p>
          <p class="text-green-600 dark:text-green-400 text-xs mt-2 font-medium">{{ stats().completedTrips }} completed</p>
        </div>
        <div class="bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-xl p-5">
          <p class="text-neutral-600 dark:text-gray-400 text-sm font-medium">Total Drivers</p>
          <p class="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">{{ stats().totalDrivers }}</p>
          <p class="text-blue-600 dark:text-blue-400 text-xs mt-2 font-medium">{{ stats().availableDrivers }} available</p>
        </div>
        <div class="bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-xl p-5">
          <p class="text-neutral-600 dark:text-gray-400 text-sm font-medium">Avg Efficiency</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">{{ stats().avgEfficiency }}%</p>
          <p class="text-green-600 dark:text-green-400 text-xs mt-2 font-medium">Fleet average</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
       <div class="bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-xl p-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trip Status Distribution</h3>
          <div class="space-y-4">
             <div>
               <div class="flex items-center justify-between mb-2">
                 <span class="text-neutral-700 dark:text-gray-300 text-sm font-medium">Completed</span>
                <span class="text-gray-900 dark:text-white text-sm font-semibold">{{ stats().completedTrips }} trips</span>
              </div>
               <div class="h-3 bg-neutral-200 dark:bg-gray-700 rounded-full overflow-hidden">
                 <div class="h-full bg-green-600 dark:bg-green-500 rounded-full" [style.width.%]="completedPercent()"></div>
               </div>
            </div>
            <div>
               <div class="flex items-center justify-between mb-2">
                 <span class="text-neutral-700 dark:text-gray-300 text-sm font-medium">In Transit</span>
                <span class="text-gray-900 dark:text-white text-sm font-semibold">{{ stats().activeTrips }} trips</span>
              </div>
               <div class="h-3 bg-neutral-200 dark:bg-gray-700 rounded-full overflow-hidden">
                 <div class="h-full bg-amber-600 dark:bg-amber-500 rounded-full" [style.width.%]="transitPercent()"></div>
               </div>
            </div>
            <div>
               <div class="flex items-center justify-between mb-2">
                 <span class="text-neutral-700 dark:text-gray-300 text-sm font-medium">Delayed</span>
                <span class="text-gray-900 dark:text-white text-sm font-semibold">{{ stats().delayedTrips }} trips</span>
              </div>
               <div class="h-3 bg-neutral-200 dark:bg-gray-700 rounded-full overflow-hidden">
                 <div class="h-full bg-red-600 dark:bg-red-500 rounded-full" [style.width.%]="delayedPercent()"></div>
               </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl p-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Fleet Utilization</h3>
          <div class="space-y-4">
            <div>
               <div class="flex items-center justify-between mb-2">
                 <span class="text-neutral-700 dark:text-gray-300 text-sm font-medium">Active Vehicles</span>
                <span class="text-gray-900 dark:text-white text-sm font-semibold">{{ stats().activeVehicles }} / {{ stats().totalVehicles }}</span>
              </div>
               <div class="h-3 bg-neutral-200 dark:bg-gray-700 rounded-full overflow-hidden">
                 <div class="h-full bg-green-600 dark:bg-green-500 rounded-full" [style.width.%]="vehicleUtilPercent()"></div>
               </div>
            </div>
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-neutral-700 dark:text-gray-300 text-sm font-medium">Driver Availability</span>
                <span class="text-gray-900 dark:text-white text-sm font-semibold">{{ stats().availableDrivers }} / {{ stats().totalDrivers }}</span>
              </div>
               <div class="h-3 bg-neutral-200 dark:bg-gray-700 rounded-full overflow-hidden">
                 <div class="h-full bg-amber-600 dark:bg-amber-500 rounded-full" [style.width.%]="driverUtilPercent()"></div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl p-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Fleet Summary</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-neutral-50 dark:bg-slate-700/50 rounded-lg p-4 text-center">
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats().activeVehicles }}</p>
            <p class="text-neutral-600 dark:text-slate-400 text-sm mt-1 font-medium">Active</p>
          </div>
           <div class="bg-neutral-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
             <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ stats().totalVehicles - stats().activeVehicles }}</p>
             <p class="text-neutral-600 dark:text-gray-400 text-sm mt-1 font-medium">Idle/Maintenance</p>
          </div>
           <div class="bg-neutral-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
             <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ stats().activeTrips }}</p>
             <p class="text-neutral-600 dark:text-gray-400 text-sm mt-1 font-medium">Active Trips</p>
           </div>
           <div class="bg-neutral-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
             <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ stats().delayedTrips }}</p>
             <p class="text-neutral-600 dark:text-gray-400 text-sm mt-1 font-medium">Delayed</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ReportsComponent implements OnInit {
  stats = signal<DashboardStats>({
    totalVehicles: 0, activeVehicles: 0, totalTrips: 0,
    activeTrips: 0, completedTrips: 0, delayedTrips: 0,
    totalDrivers: 0, availableDrivers: 0, alertsCount: 0, avgEfficiency: 0,
  });

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
      const statsFromApi = this.dataService.getDashboardStatsSignal()();
      if (statsFromApi) {
        this.stats.set(statsFromApi);
      } else {
        this.stats.set(this.dataService.getStats());
      }
    }, 1000);
  }

  completedPercent(): number {
    if (this.stats().totalTrips === 0) return 0;
    return (this.stats().completedTrips / this.stats().totalTrips) * 100;
  }

  transitPercent(): number {
    if (this.stats().totalTrips === 0) return 0;
    return (this.stats().activeTrips / this.stats().totalTrips) * 100;
  }

  delayedPercent(): number {
    if (this.stats().totalTrips === 0) return 0;
    return (this.stats().delayedTrips / this.stats().totalTrips) * 100;
  }

  vehicleUtilPercent(): number {
    if (this.stats().totalVehicles === 0) return 0;
    return (this.stats().activeVehicles / this.stats().totalVehicles) * 100;
  }

  driverUtilPercent(): number {
    if (this.stats().totalDrivers === 0) return 0;
    return (this.stats().availableDrivers / this.stats().totalDrivers) * 100;
  }
}
