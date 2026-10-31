import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout.component';
import { LoginComponent } from './features/auth/login.component';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'fleet', loadComponent: () => import('./features/fleet/fleet.component').then(m => m.FleetComponent) },
      { path: 'tracking', loadComponent: () => import('./features/tracking/tracking.component').then(m => m.TrackingComponent) },
      { path: 'trips', loadComponent: () => import('./features/trips/trips.component').then(m => m.TripsComponent) },
      { path: 'telemetry', loadComponent: () => import('./features/telemetry/telemetry.component').then(m => m.TelemetryComponent) },
      { path: 'reports', loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
