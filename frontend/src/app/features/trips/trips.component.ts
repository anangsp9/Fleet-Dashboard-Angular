import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { Trip } from '../../core/models';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Trip Management</h1>
           <p class="text-neutral-600 dark:text-gray-400 mt-1">Track and manage all delivery trips</p>
        </div>
        <button (click)="refreshData()" class="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 w-fit">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Refresh
        </button>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
        @for (status of statusFilters; track status.value) {
          <button (click)="filterStatus = status.value"
                  class="p-3 sm:p-4 rounded-xl border transition-all text-center"
                  [ngClass]="filterStatus === status.value ? 'bg-amber-100 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500' : 'bg-white dark:bg-slate-800 border-neutral-200 dark:border-slate-700 hover:border-neutral-300 dark:hover:border-slate-600'">
            <p class="text-xl sm:text-2xl font-bold" [ngClass]="filterStatus === status.value ? 'text-amber-700 dark:text-amber-400' : 'text-gray-900 dark:text-white'">{{ getStatusCount(status.value) }}</p>
            <p class="text-xs sm:text-sm mt-1" [ngClass]="filterStatus === status.value ? 'text-amber-600 dark:text-amber-300' : 'text-neutral-600 dark:text-slate-400'">{{ status.label }}</p>
          </button>
        }
      </div>

       <div class="bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-xl overflow-hidden">
         <div class="p-4 border-b border-neutral-200 dark:border-gray-700">
           <div class="relative">
             <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
             <input type="text" [(ngModel)]="searchTerm" placeholder="Search trips..."
                    class="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-gray-700 border border-neutral-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-neutral-500 dark:placeholder-gray-400 text-sm focus:outline-none focus:border-amber-500 dark:focus:border-amber-500"/>
          </div>
        </div>

        <div class="space-y-0 max-h-[800px] overflow-y-auto">
           @if (filteredTrips().length === 0) {
             <div class="p-12 text-center text-neutral-600 dark:text-gray-400">No trips found</div>
           }
           @for (trip of filteredTrips(); track trip.id) {
             <div class="p-4 border-b border-neutral-200 dark:border-gray-700 hover:bg-neutral-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                 (click)="selectTrip(trip)">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                       [ngClass]="{
                         'bg-green-100 dark:bg-green-500/20': trip.status === 'in-transit',
                         'bg-red-100 dark:bg-red-500/20': trip.status === 'delayed',
                         'bg-yellow-100 dark:bg-yellow-500/20': trip.status === 'pending',
                            'bg-neutral-100 dark:bg-gray-600': trip.status === 'completed' || trip.status === 'cancelled'
                       }">
                    <svg class="w-6 h-6" [ngClass]="{
                      'text-green-600 dark:text-green-400': trip.status === 'in-transit',
                      'text-red-600 dark:text-red-400': trip.status === 'delayed',
                      'text-yellow-600 dark:text-yellow-500': trip.status === 'pending',
                       'text-neutral-600 dark:text-gray-400': trip.status === 'completed' || trip.status === 'cancelled'
                    }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                    </svg>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <p class="text-gray-900 dark:text-white font-semibold text-sm">{{ trip.origin }}</p>
                      <svg class="w-4 h-4 text-neutral-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                      </svg>
                      <p class="text-gray-900 dark:text-white font-semibold text-sm">{{ trip.destination }}</p>
                    </div>
                    <p class="text-neutral-600 dark:text-gray-400 text-xs mt-1">{{ getVehiclePlate(trip.vehicleId) }} • {{ getDriverName(trip.driverId) }} • {{ trip.distance }}km</p>
                  </div>
                </div>

                <div class="flex items-center gap-2 sm:gap-4 justify-between sm:justify-end">
                  <div class="hidden sm:flex items-center gap-4 text-sm">
                    <div class="text-center">
                       <p class="text-neutral-600 dark:text-gray-400 text-xs font-medium">Load</p>
                       <p class="text-gray-900 dark:text-white font-semibold">{{ trip.loadWeight }}kg</p>
                     </div>
                     <div class="text-center">
                       <p class="text-neutral-600 dark:text-gray-400 text-xs font-medium">ETA</p>
                      <p class="text-gray-900 dark:text-white font-semibold">{{ trip.eta ? formatTime(trip.eta) : '-' }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-2 flex-wrap justify-end">
                    @if (trip.isOverload) {
                      <span class="px-2 py-1 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 text-xs rounded-full font-medium">Overload</span>
                    }
                    @if (trip.isOverDimension) {
                      <span class="px-2 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 text-xs rounded-full font-medium">Over-Dim</span>
                    }
                    <span class="px-2 py-1 rounded-full text-xs font-medium capitalize"
                          [ngClass]="{
                           'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400': trip.status === 'in-transit',
                           'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400': trip.status === 'delayed',
                           'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-600': trip.status === 'pending',
                            'bg-neutral-100 dark:bg-gray-600 text-neutral-700 dark:text-gray-300': trip.status === 'completed'
                         }">
                      {{ trip.status | titlecase }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

         <div class="px-4 py-3 border-t border-neutral-200 dark:border-gray-700 flex items-center justify-between">
           <p class="text-neutral-600 dark:text-gray-400 text-sm">Showing {{ filteredTrips().length }} of {{ allTrips().length }} trips</p>
         </div>
      </div>
    </div>
  `,
})
export class TripsComponent implements OnInit {
  allTrips = signal<Trip[]>([]);
  selectedTrip = signal<Trip | null>(null);
  filterStatus = 'all';
  searchTerm = '';

  statusFilters = [
    { value: 'all', label: 'All Trips' },
    { value: 'in-transit', label: 'In Transit' },
    { value: 'pending', label: 'Pending' },
    { value: 'delayed', label: 'Delayed' },
    { value: 'completed', label: 'Completed' },
  ];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void {
    this.dataService.fetchTrips();
    this.dataService.fetchVehicles();
    this.dataService.fetchDrivers();
    setTimeout(() => {
      this.allTrips.set(this.dataService.getTrips()());
    }, 1000);
  }

  filteredTrips(): Trip[] {
    return this.allTrips().filter(t => {
      const matchStatus = this.filterStatus === 'all' || t.status === this.filterStatus;
      const matchSearch = !this.searchTerm ||
        t.origin.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        t.destination.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });
  }

  getStatusCount(status: string): number {
    if (status === 'all') return this.allTrips().length;
    return this.allTrips().filter(t => t.status === status).length;
  }

  selectTrip(trip: Trip): void {
    this.selectedTrip.set(trip);
  }

  getVehiclePlate(vehicleId: string): string {
    return this.dataService.getVehicleById(vehicleId)?.plate || 'Unknown';
  }

  getDriverName(driverId: string): string {
    return this.dataService.getDriverById(driverId)?.name || 'Unknown';
  }

  formatTime(isoString: string): string {
    return new Date(isoString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }
}
