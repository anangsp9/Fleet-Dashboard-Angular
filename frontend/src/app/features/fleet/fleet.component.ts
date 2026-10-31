import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { Vehicle } from '../../core/models';

@Component({
  selector: 'app-fleet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Fleet Management</h1>
           <p class="text-neutral-600 dark:text-gray-400 mt-1">Manage your vehicles and drivers</p>
        </div>
        <button (click)="refreshData()" class="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 w-fit">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Refresh
        </button>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
           <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
           <input type="text" [(ngModel)]="searchTerm" placeholder="Search vehicles..."
                  class="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-neutral-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-neutral-500 dark:placeholder-gray-400 text-sm focus:outline-none focus:border-amber-500 dark:focus:border-amber-500"/>
        </div>
         <select [(ngModel)]="filterType"
                 class="bg-white dark:bg-gray-700 border border-neutral-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 dark:focus:border-amber-500">
          <option value="all">All Types</option>
          <option value="truck">Truck</option>
          <option value="trailer">Trailer</option>
          <option value="van">Van</option>
        </select>
         <select [(ngModel)]="filterStatus"
                 class="bg-white dark:bg-gray-700 border border-neutral-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 dark:focus:border-amber-500">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="idle">Idle</option>
          <option value="maintenance">Maintenance</option>
          <option value="offline">Offline</option>
        </select>
      </div>

       <div class="hidden lg:block bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-neutral-200 dark:border-gray-700">
                <th class="text-left px-4 py-3 text-neutral-600 dark:text-gray-400 text-sm font-semibold">Vehicle</th>
                 <th class="text-left px-4 py-3 text-neutral-600 dark:text-gray-400 text-sm font-semibold">Plate</th>
                 <th class="text-left px-4 py-3 text-neutral-600 dark:text-gray-400 text-sm font-semibold">Type</th>
                 <th class="text-left px-4 py-3 text-neutral-600 dark:text-gray-400 text-sm font-semibold">Status</th>
                 <th class="text-left px-4 py-3 text-neutral-600 dark:text-gray-400 text-sm font-semibold">Fuel</th>
                 <th class="text-left px-4 py-3 text-neutral-600 dark:text-gray-400 text-sm font-semibold">Capacity</th>
                 <th class="text-left px-4 py-3 text-neutral-600 dark:text-gray-400 text-sm font-semibold">Driver</th>
              </tr>
            </thead>
            <tbody>
               @if (filteredVehicles().length === 0) {
                 <tr>
                   <td colspan="7" class="px-4 py-12 text-center text-neutral-600 dark:text-gray-400">No vehicles found</td>
                 </tr>
               }
               @for (vehicle of filteredVehicles(); track vehicle.id) {
                 <tr class="border-b border-neutral-200 dark:border-gray-700 hover:bg-neutral-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                           [ngClass]="{
                             'bg-amber-100 dark:bg-amber-500/20': vehicle.type === 'truck',
                             'bg-green-100 dark:bg-green-500/20': vehicle.type === 'trailer',
                             'bg-blue-100 dark:bg-blue-500/20': vehicle.type === 'van'
                           }">
                        <svg class="w-5 h-5" [ngClass]="{
                           'text-amber-600 dark:text-amber-400': vehicle.type === 'truck',
                           'text-green-600 dark:text-green-400': vehicle.type === 'trailer',
                           'text-blue-600 dark:text-blue-400': vehicle.type === 'van'
                         }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                        </svg>
                      </div>
                      <div>
                        <p class="text-gray-900 dark:text-white font-medium text-sm">{{ vehicle.brand }} {{ vehicle.model }}</p>
                         <p class="text-neutral-600 dark:text-gray-400 text-xs">{{ vehicle.year }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <span class="text-gray-900 dark:text-white text-sm font-mono">{{ vehicle.plate }}</span>
                  </td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-1 rounded-full text-xs font-medium capitalize"
                          [ngClass]="{
                           'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400': vehicle.type === 'truck',
                           'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400': vehicle.type === 'trailer',
                           'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400': vehicle.type === 'van'
                         }">
                      {{ vehicle.type }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-1 rounded-full text-xs font-medium capitalize"
                          [ngClass]="{
                           'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400': vehicle.status === 'active',
                           'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-600': vehicle.status === 'idle',
                           'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400': vehicle.status === 'maintenance',
                            'bg-neutral-100 dark:bg-gray-600 text-neutral-700 dark:text-gray-300': vehicle.status === 'offline'
                         }">
                      {{ vehicle.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                       <div class="w-16 h-1.5 bg-neutral-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all"
                             [ngClass]="{
                               'bg-green-500 dark:bg-green-400': vehicle.fuelLevel > 50,
                               'bg-yellow-500 dark:bg-yellow-400': vehicle.fuelLevel > 20 && vehicle.fuelLevel <= 50,
                               'bg-red-500 dark:bg-red-400': vehicle.fuelLevel <= 20
                             }"
                             [style.width.%]="vehicle.fuelLevel"></div>
                      </div>
                       <span class="text-neutral-700 dark:text-gray-300 text-xs font-medium">{{ vehicle.fuelLevel }}%</span>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <span class="text-gray-900 dark:text-white text-sm font-medium">{{ vehicle.capacity }}kg</span>
                  </td>
                  <td class="px-4 py-3">
                     <span class="text-neutral-700 dark:text-gray-300 text-sm">{{ getDriverName(vehicle.id) }}</span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
         <div class="px-4 py-3 border-t border-neutral-200 dark:border-gray-700 flex items-center justify-between">
           <p class="text-neutral-600 dark:text-gray-400 text-sm">Showing {{ filteredVehicles().length }} of {{ vehicles().length }} vehicles</p>
         </div>
      </div>

      <div class="lg:hidden space-y-3">
         @if (filteredVehicles().length === 0) {
           <div class="bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-xl p-8 text-center">
             <p class="text-neutral-600 dark:text-gray-400">No vehicles found</p>
           </div>
         }
         @for (vehicle of filteredVehicles(); track vehicle.id) {
           <div class="bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-xl p-4">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3 flex-1">
                <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                     [ngClass]="{
                       'bg-amber-100 dark:bg-amber-500/20': vehicle.type === 'truck',
                       'bg-green-100 dark:bg-green-500/20': vehicle.type === 'trailer',
                       'bg-blue-100 dark:bg-blue-500/20': vehicle.type === 'van'
                     }">
                  <svg class="w-6 h-6" [ngClass]="{
                     'text-amber-600 dark:text-amber-400': vehicle.type === 'truck',
                     'text-green-600 dark:text-green-400': vehicle.type === 'trailer',
                     'text-blue-600 dark:text-blue-400': vehicle.type === 'van'
                   }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                  </svg>
                </div>
                <div class="min-w-0">
                  <p class="text-gray-900 dark:text-white font-semibold text-sm">{{ vehicle.brand }} {{ vehicle.model }}</p>
                  <p class="text-neutral-600 dark:text-slate-400 text-xs">{{ vehicle.plate }}</p>
                </div>
              </div>
              <span class="px-2 py-1 rounded-full text-xs font-medium capitalize flex-shrink-0"
                    [ngClass]="{
                     'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400': vehicle.status === 'active',
                     'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-600': vehicle.status === 'idle',
                     'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400': vehicle.status === 'maintenance',
                      'bg-neutral-100 dark:bg-gray-600 text-neutral-700 dark:text-gray-300': vehicle.status === 'offline'
                   }">
                {{ vehicle.status }}
              </span>
            </div>
            <div class="mt-3 space-y-2">
              <div class="flex justify-between items-center">
                 <span class="text-neutral-600 dark:text-gray-400 text-xs">Fuel</span>
                 <div class="flex items-center gap-2">
                   <div class="w-24 h-1.5 bg-neutral-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div class="h-full rounded-full"
                         [ngClass]="{
                           'bg-green-500 dark:bg-green-400': vehicle.fuelLevel > 50,
                           'bg-yellow-500 dark:bg-yellow-400': vehicle.fuelLevel > 20 && vehicle.fuelLevel <= 50,
                           'bg-red-500 dark:bg-red-400': vehicle.fuelLevel <= 20
                         }"
                         [style.width.%]="vehicle.fuelLevel"></div>
                  </div>
                   <span class="text-neutral-700 dark:text-gray-300 text-xs font-medium">{{ vehicle.fuelLevel }}%</span>
                </div>
              </div>
               <div class="flex justify-between">
                 <span class="text-neutral-600 dark:text-gray-400 text-xs">Capacity</span>
                 <span class="text-gray-900 dark:text-white text-xs font-medium">{{ vehicle.capacity }}kg</span>
               </div>
               <div class="flex justify-between">
                 <span class="text-neutral-600 dark:text-gray-400 text-xs">Driver</span>
                 <span class="text-gray-900 dark:text-white text-xs font-medium">{{ getDriverName(vehicle.id) }}</span>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class FleetComponent implements OnInit {
  vehicles = signal<Vehicle[]>([]);
  searchTerm = '';
  filterType = 'all';
  filterStatus = 'all';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void {
    this.dataService.fetchVehicles();
    this.dataService.fetchDrivers();
    setTimeout(() => {
      this.vehicles.set(this.dataService.getVehicles()());
    }, 1000);
  }

  filteredVehicles(): Vehicle[] {
    return this.vehicles().filter(v => {
      const matchSearch = !this.searchTerm ||
        v.brand.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        v.model.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        v.plate.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchType = this.filterType === 'all' || v.type === this.filterType;
      const matchStatus = this.filterStatus === 'all' || v.status === this.filterStatus;
      return matchSearch && matchType && matchStatus;
    });
  }

  getDriverName(vehicleId: string): string {
    const drivers = this.dataService.getDrivers()();
    const driver = drivers.find(d => d.assignedVehicleId === vehicleId);
    return driver?.name || 'Unassigned';
  }
}
