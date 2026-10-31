import { Component, OnInit, OnDestroy, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { Trip, Telemetry } from '../../core/models';
import * as L from 'leaflet';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Live Fleet Tracking</h1>
           <p class="text-neutral-600 dark:text-gray-400 mt-1">Real-time vehicle positions on the map</p>
        </div>
        <div class="flex items-center gap-3">
          <button (click)="refreshData()"
                  class="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Refresh
          </button>
          <button (click)="simulateUpdates()"
                  class="bg-green-600 hover:bg-green-700 active:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Simulate Movement
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div class="lg:col-span-3 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <div id="map" class="h-[500px] sm:h-[600px] w-full"></div>
        </div>

        <div class="space-y-4">
           <div class="bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-xl p-4">
             <h3 class="text-gray-900 dark:text-white font-semibold mb-3">Active Vehicles</h3>
             @if (activeTrips().length === 0) {
               <p class="text-neutral-600 dark:text-gray-400 text-sm text-center py-4">No active trips</p>
             } @else {
               <div class="space-y-2 max-h-[200px] overflow-y-auto">
                @for (trip of activeTrips(); track trip.id) {
                   <button (click)="focusVehicle(trip)"
                           class="w-full text-left p-3 bg-neutral-50 dark:bg-gray-700/50 hover:bg-neutral-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full" [ngClass]="trip.status === 'delayed' ? 'bg-red-500' : 'bg-green-500'"></div>
                        <div>
                          <p class="text-gray-900 dark:text-white text-sm font-medium">{{ getVehiclePlate(trip.vehicleId) }}</p>
                           <p class="text-neutral-600 dark:text-gray-400 text-xs">{{ trip.origin }} → {{ trip.destination }}</p>
                        </div>
                      </div>
                      <span class="text-neutral-600 dark:text-gray-400 text-xs font-medium">{{ trip.distance }}km</span>
                    </div>
                  </button>
                }
              </div>
            }
          </div>

           <div class="bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-xl p-4">
             <h3 class="text-gray-900 dark:text-white font-semibold mb-3">Trip Details</h3>
            @if (selectedTrip()) {
              <div class="space-y-3">
                <div class="flex justify-between">
                   <span class="text-neutral-600 dark:text-gray-400 text-sm font-medium">Route</span>
                   <span class="text-gray-900 dark:text-white text-sm">{{ selectedTrip()!.origin }} → {{ selectedTrip()!.destination }}</span>
                 </div>
                 <div class="flex justify-between">
                   <span class="text-neutral-600 dark:text-gray-400 text-sm font-medium">Distance</span>
                   <span class="text-gray-900 dark:text-white text-sm">{{ selectedTrip()!.distance }}km</span>
                 </div>
                 <div class="flex justify-between">
                   <span class="text-neutral-600 dark:text-gray-400 text-sm font-medium">Load</span>
                   <span class="text-gray-900 dark:text-white text-sm">{{ selectedTrip()!.loadWeight }}kg</span>
                 </div>
                 <div class="flex justify-between">
                   <span class="text-neutral-600 dark:text-gray-400 text-sm font-medium">Status</span>
                  <span class="px-2 py-0.5 rounded-full text-xs font-medium"
                        [ngClass]="{
                         'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400': selectedTrip()!.status === 'in-transit',
                         'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400': selectedTrip()!.status === 'delayed'
                       }">
                    {{ selectedTrip()!.status | titlecase }}
                  </span>
                </div>
                @if (selectedTrip()!.isOverload) {
                  <div class="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-2">
                    <p class="text-red-700 dark:text-red-400 text-xs font-semibold">⚠ Overloaded</p>
                  </div>
                }
              </div>
            } @else {
               <p class="text-neutral-600 dark:text-gray-400 text-sm text-center py-4">Select a vehicle to view details</p>
            }
          </div>

           <div class="bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-xl p-4">
             <h3 class="text-gray-900 dark:text-white font-semibold mb-3">Map Legend</h3>
             <div class="space-y-2">
               <div class="flex items-center gap-2">
                 <div class="w-3 h-3 rounded-full bg-green-500"></div>
                 <span class="text-neutral-700 dark:text-gray-300 text-sm font-medium">On Schedule</span>
               </div>
               <div class="flex items-center gap-2">
                 <div class="w-3 h-3 rounded-full bg-red-500"></div>
                 <span class="text-neutral-700 dark:text-gray-300 text-sm font-medium">Delayed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TrackingComponent implements OnInit, AfterViewInit, OnDestroy {
  activeTrips = signal<Trip[]>([]);
  selectedTrip = signal<Trip | null>(null);

  private map: L.Map | null = null;
  private markers: Map<string, L.Marker> = new Map();
  private polyline: L.Polyline | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.refreshData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 100);
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  refreshData(): void {
    this.dataService.fetchVehicles();
    this.dataService.fetchTrips();
    setTimeout(() => {
      this.activeTrips.set(this.dataService.getActiveTrips());
      this.updateMarkers();
    }, 1000);
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [-2.5, 118],
      zoom: 5,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19,
    }).addTo(this.map);

    this.updateMarkers();
  }

  private updateMarkers(): void {
    if (!this.map) return;

    this.markers.forEach(marker => marker.remove());
    this.markers.clear();
    if (this.polyline) this.polyline.remove();

    this.activeTrips().forEach(trip => {
      const vehicle = this.dataService.getVehicleById(trip.vehicleId);
      if (!vehicle) return;

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="w-8 h-8 rounded-full ${trip.status === 'delayed' ? 'bg-red-500' : 'bg-green-500'} flex items-center justify-center shadow-lg border-2 border-white">
                 <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                 </svg>
               </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([trip.originCoords.lat, trip.originCoords.lng], { icon })
        .addTo(this.map!)
        .bindPopup(`
          <div class="p-2">
            <p class="font-semibold">${vehicle.plate}</p>
            <p class="text-sm text-gray-600">${trip.origin} → ${trip.destination}</p>
            <p class="text-sm text-gray-600">${vehicle.brand} ${vehicle.model}</p>
          </div>
        `);

      marker.on('click', () => this.selectTrip(trip));
      this.markers.set(trip.id, marker);
    });

    const coords = this.activeTrips().map(t => [t.originCoords.lat, t.originCoords.lng] as [number, number]);
    if (coords.length > 0) {
      this.polyline = L.polyline(coords, { color: '#3b82f6', weight: 2, opacity: 0.5 }).addTo(this.map!);
      this.map!.fitBounds(L.latLngBounds(coords), { padding: [50, 50] });
    }
  }

  selectTrip(trip: Trip): void {
    this.selectedTrip.set(trip);
    this.map?.setView([trip.originCoords.lat, trip.originCoords.lng], 8);
  }

  focusVehicle(trip: Trip): void {
    this.selectTrip(trip);
    this.markers.get(trip.id)?.openPopup();
  }

  simulateUpdates(): void {
    this.activeTrips().forEach(trip => {
      const lat = trip.originCoords.lat + (Math.random() - 0.5) * 2;
      const lng = trip.originCoords.lng + (Math.random() - 0.5) * 2;
      const marker = this.markers.get(trip.id);
      if (marker) {
        marker.setLatLng([lat, lng]);
      }
    });
  }

  getVehiclePlate(vehicleId: string): string {
    return this.dataService.getVehicleById(vehicleId)?.plate || 'Unknown';
  }
}
