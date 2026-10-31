import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { Telemetry, Trip } from '../../core/models';

@Component({
  selector: 'app-telemetry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Vehicle Telemetry</h1>
           <p class="text-neutral-600 dark:text-gray-400 mt-1">Real-time vehicle metrics and diagnostics</p>
        </div>
        <div class="flex items-center gap-3">
           <select [(ngModel)]="selectedTripId" (change)="onTripChange()"
                   class="bg-white dark:bg-gray-700 border border-neutral-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 dark:focus:border-amber-500">
            <option value="">Select a trip</option>
            @for (trip of allTrips(); track trip.id) {
              <option [value]="trip.id">{{ getVehiclePlate(trip.vehicleId) }} - {{ trip.origin }} → {{ trip.destination }}</option>
            }
          </select>
          <button (click)="refreshData()" class="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Refresh
          </button>
        </div>
      </div>

      @if (selectedTelemetry().length > 0) {
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl p-5">
            <div class="flex items-center justify-between mb-3">
               <span class="text-neutral-600 dark:text-gray-400 text-sm font-medium">Speed</span>
               <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
             <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ latestTelemetry()?.speed?.toFixed(0) || 0 }} <span class="text-sm text-neutral-600 dark:text-gray-400">km/h</span></p>
            <div class="mt-2 h-2 bg-neutral-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div class="h-full bg-amber-600 dark:bg-amber-500 rounded-full transition-all" [style.width.%]="(latestTelemetry()?.speed || 0) / 1.2"></div>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl p-5">
            <div class="flex items-center justify-between mb-3">
               <span class="text-neutral-600 dark:text-gray-400 text-sm font-medium">Fuel Level</span>
               <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
              </svg>
            </div>
             <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ latestTelemetry()?.fuelLevel?.toFixed(0) || 0 }}<span class="text-sm text-neutral-600 dark:text-gray-400">%</span></p>
             <div class="mt-2 h-2 bg-neutral-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all"
                   [ngClass]="{
                     'bg-green-500 dark:bg-green-400': (latestTelemetry()?.fuelLevel || 0) > 50,
                     'bg-yellow-500 dark:bg-yellow-400': (latestTelemetry()?.fuelLevel || 0) > 20 && (latestTelemetry()?.fuelLevel || 0) <= 50,
                     'bg-red-500 dark:bg-red-400': (latestTelemetry()?.fuelLevel || 0) <= 20
                   }"
                   [style.width.%]="latestTelemetry()?.fuelLevel || 0"></div>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl p-5">
            <div class="flex items-center justify-between mb-3">
               <span class="text-neutral-600 dark:text-gray-400 text-sm font-medium">Engine Temp</span>
               <svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"/>
              </svg>
            </div>
             <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ latestTelemetry()?.engineTemp?.toFixed(0) || 0 }}<span class="text-sm text-neutral-600 dark:text-gray-400">°C</span></p>
             <div class="mt-2 h-2 bg-neutral-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all"
                   [ngClass]="{
                     'bg-green-500 dark:bg-green-400': (latestTelemetry()?.engineTemp || 0) < 90,
                     'bg-yellow-500 dark:bg-yellow-400': (latestTelemetry()?.engineTemp || 0) >= 90 && (latestTelemetry()?.engineTemp || 0) < 100,
                     'bg-red-500 dark:bg-red-400': (latestTelemetry()?.engineTemp || 0) >= 100
                   }"
                   [style.width.%]="((latestTelemetry()?.engineTemp || 0) / 120) * 100"></div>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl p-5">
            <div class="flex items-center justify-between mb-3">
               <span class="text-neutral-600 dark:text-gray-400 text-sm font-medium">Tire Pressure</span>
               <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
             <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ latestTelemetry()?.tirePressure?.toFixed(0) || 0 }}<span class="text-sm text-neutral-600 dark:text-gray-400">psi</span></p>
            <div class="mt-2 h-2 bg-neutral-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div class="h-full bg-amber-600 dark:bg-amber-500 rounded-full transition-all"
                   [style.width.%]="((latestTelemetry()?.tirePressure || 0) / 50) * 100"></div>
            </div>
          </div>
        </div>

           <div class="bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-xl overflow-hidden">
             <div class="p-4 border-b border-neutral-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Telemetry Log</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                 <tr class="border-b border-neutral-200 dark:border-gray-700">
                   <th class="text-left px-4 py-3 text-neutral-600 dark:text-gray-400 text-sm font-semibold">Time</th>
                   <th class="text-left px-4 py-3 text-neutral-600 dark:text-gray-400 text-sm font-semibold">Speed</th>
                   <th class="text-left px-4 py-3 text-neutral-600 dark:text-gray-400 text-sm font-semibold">Fuel</th>
                   <th class="text-left px-4 py-3 text-neutral-600 dark:text-gray-400 text-sm font-semibold">Consumption</th>
                   <th class="text-left px-4 py-3 text-neutral-600 dark:text-gray-400 text-sm font-semibold">Engine</th>
                   <th class="text-left px-4 py-3 text-neutral-600 dark:text-gray-400 text-sm font-semibold">Tire</th>
                </tr>
              </thead>
              <tbody>
                @for (data of selectedTelemetry(); track data.id) {
                  <tr class="border-b border-neutral-200 dark:border-gray-700 hover:bg-neutral-50 dark:hover:bg-gray-700/30">
                    <td class="px-4 py-3 text-gray-900 dark:text-white text-sm">{{ formatTime(data.timestamp) }}</td>
                    <td class="px-4 py-3 text-gray-900 dark:text-white text-sm">{{ data.speed.toFixed(0) }} km/h</td>
                    <td class="px-4 py-3 text-gray-900 dark:text-white text-sm">{{ data.fuelLevel.toFixed(0) }}%</td>
                    <td class="px-4 py-3 text-gray-900 dark:text-white text-sm">{{ data.fuelConsumption.toFixed(1) }} L/h</td>
                    <td class="px-4 py-3 text-gray-900 dark:text-white text-sm">{{ data.engineTemp.toFixed(0) }}°C</td>
                    <td class="px-4 py-3 text-gray-900 dark:text-white text-sm">{{ data.tirePressure.toFixed(0) }} psi</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      } @else {
        <div class="bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-xl p-12 text-center">
           <svg class="w-16 h-16 text-neutral-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
           </svg>
           <h3 class="text-gray-900 dark:text-white text-lg font-semibold mb-2">No Telemetry Data</h3>
           <p class="text-neutral-600 dark:text-gray-400">Select a trip to view telemetry data</p>
         </div>
      }
    </div>
  `,
})
export class TelemetryComponent implements OnInit {
  allTrips = signal<Trip[]>([]);
  selectedTripId = '';
  selectedTelemetry = signal<Telemetry[]>([]);

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void {
    this.dataService.fetchTrips();
    setTimeout(() => {
      this.allTrips.set(this.dataService.getTrips()());
      const activeTrips = this.dataService.getActiveTrips();
      if (activeTrips.length > 0 && !this.selectedTripId) {
        this.selectedTripId = activeTrips[0].id;
        this.onTripChange();
      }
    }, 1000);
  }

  onTripChange(): void {
    if (this.selectedTripId) {
      this.dataService.fetchTelemetry(this.selectedTripId);
      setTimeout(() => {
        this.selectedTelemetry.set(this.dataService.getTelemetry()());
      }, 500);
    } else {
      this.selectedTelemetry.set([]);
    }
  }

  latestTelemetry(): Telemetry | undefined {
    const data = this.selectedTelemetry();
    return data.length > 0 ? data[data.length - 1] : undefined;
  }

  getVehiclePlate(vehicleId: string): string {
    return this.dataService.getVehicleById(vehicleId)?.plate || 'Unknown';
  }

  formatTime(isoString: string): string {
    return new Date(isoString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }
}
