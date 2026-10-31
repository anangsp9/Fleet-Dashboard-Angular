import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  Vehicle, Driver, Trip, Telemetry,
  DashboardStats, Alert
} from '../models';

@Injectable({ providedIn: 'root' })
export class DataService {
  private apiUrl = 'http://localhost:3000/api';

  private vehicles = signal<Vehicle[]>([]);
  private drivers = signal<Driver[]>([]);
  private trips = signal<Trip[]>([]);
  private telemetry = signal<Telemetry[]>([]);
  private alerts = signal<Alert[]>([]);
  private dashboardStats = signal<DashboardStats | null>(null);

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Getters
  getVehicles = () => this.vehicles.asReadonly();
  getDrivers = () => this.drivers.asReadonly();
  getTrips = () => this.trips.asReadonly();
  getTelemetry = () => this.telemetry.asReadonly();
  getAlerts = () => this.alerts.asReadonly();
  getDashboardStatsSignal = () => this.dashboardStats.asReadonly();

  // Fetch from API
  fetchVehicles(): void {
    this.http.get<Vehicle[]>(`${this.apiUrl}/vehicles`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => this.vehicles.set(data),
        error: (err) => console.error('Failed to fetch vehicles:', err.error?.error || err.message),
      });
  }

  fetchDrivers(): void {
    this.http.get<Driver[]>(`${this.apiUrl}/drivers`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => this.drivers.set(data),
        error: (err) => console.error('Failed to fetch drivers:', err.error?.error || err.message),
      });
  }

  fetchTrips(): void {
    this.http.get<Trip[]>(`${this.apiUrl}/trips`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => this.trips.set(data),
        error: (err) => console.error('Failed to fetch trips:', err.error?.error || err.message),
      });
  }

  fetchActiveTrips(): void {
    this.http.get<Trip[]>(`${this.apiUrl}/trips/active`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => this.trips.set(data),
        error: (err) => console.error('Failed to fetch active trips:', err.error?.error || err.message),
      });
  }

  fetchTelemetry(tripId?: string): void {
    const url = tripId
      ? `${this.apiUrl}/telemetry/trip/${tripId}`
      : `${this.apiUrl}/telemetry`;
    this.http.get<Telemetry[]>(url, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => this.telemetry.set(data),
        error: (err) => console.error('Failed to fetch telemetry:', err.error?.error || err.message),
      });
  }

  fetchAlerts(): void {
    this.http.get<any>(`${this.apiUrl}/dashboard/stats`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => {
          this.dashboardStats.set(data);
        },
        error: (err) => console.error('Failed to fetch dashboard stats:', err.error?.error || err.message),
      });
  }

  fetchDashboardStats(): void {
    this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => this.dashboardStats.set(data),
        error: (err) => console.error('Failed to fetch dashboard stats:', err.error?.error || err.message),
      });
  }

  // Lookups
  getVehicleById(id: string): Vehicle | undefined {
    return this.vehicles().find(v => v.id === id);
  }

  getDriverById(id: string): Driver | undefined {
    return this.drivers().find(d => d.id === id);
  }

  getTripsByVehicle(vehicleId: string): Trip[] {
    return this.trips().filter(t => t.vehicleId === vehicleId);
  }

  getTelemetryByTrip(tripId: string): Telemetry[] {
    return this.telemetry().filter(t => t.tripId === tripId);
  }

  getActiveTrips(): Trip[] {
    return this.trips().filter(t => t.status === 'in-transit' || t.status === 'delayed');
  }

  // Stats computed from local data
  getStats(): DashboardStats {
    const vehicles = this.vehicles();
    const trips = this.trips();
    const drivers = this.drivers();
    const alerts = this.alerts();

    return {
      totalVehicles: vehicles.length,
      activeVehicles: vehicles.filter(v => v.status === 'active').length,
      totalTrips: trips.length,
      activeTrips: trips.filter(t => t.status === 'in-transit').length,
      completedTrips: trips.filter(t => t.status === 'completed').length,
      delayedTrips: trips.filter(t => t.status === 'delayed').length,
      totalDrivers: drivers.length,
      availableDrivers: drivers.filter(d => d.status === 'available').length,
      alertsCount: alerts.filter(a => !a.acknowledged).length,
      avgEfficiency: 87.5,
    };
  }
}
