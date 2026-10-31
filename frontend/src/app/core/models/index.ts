export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  avatar?: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  type: 'truck' | 'van' | 'trailer';
  brand: string;
  model: string;
  year: number;
  capacity: number;
  weightLimit: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  status: 'active' | 'idle' | 'maintenance' | 'offline';
  fuelLevel: number;
  mileage: number;
  lastService: string;
  driverId?: string;
}

export interface Driver {
  id: string;
  name: string;
  license: string;
  phone: string;
  email: string;
  status: 'available' | 'on-trip' | 'off-duty';
  assignedVehicleId?: string;
}

export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  origin: string;
  destination: string;
  originCoords: LatLng;
  destinationCoords: LatLng;
  status: 'pending' | 'in-transit' | 'completed' | 'delayed' | 'cancelled';
  startTime?: string;
  endTime?: string;
  eta?: string;
  distance: number;
  loadWeight: number;
  loadDimensions: {
    length: number;
    width: number;
    height: number;
  };
  isOverload: boolean;
  isOverDimension: boolean;
}

export interface Telemetry {
  id: string;
  tripId: string;
  vehicleId: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  fuelLevel: number;
  fuelConsumption: number;
  engineTemp: number;
  tirePressure: number;
  timestamp: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface DashboardStats {
  totalVehicles: number;
  activeVehicles: number;
  totalTrips: number;
  activeTrips: number;
  completedTrips: number;
  delayedTrips: number;
  totalDrivers: number;
  availableDrivers: number;
  alertsCount: number;
  avgEfficiency: number;
}

export interface Alert {
  id: string;
  type: 'overload' | 'speed' | 'fuel' | 'maintenance' | 'deviation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  vehicleId: string;
  tripId?: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}
