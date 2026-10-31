import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Telemetry } from '../models';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket | null = null;
  private connected = signal(false);
  private vehicleLocations = signal<Map<string, Telemetry>>(new Map());

  isConnected = this.connected.asReadonly();
  locations = this.vehicleLocations.asReadonly();

  connect(serverUrl: string = 'http://localhost:3000'): void {
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: false,
    });

    this.socket.on('connect', () => {
      this.connected.set(true);
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      this.connected.set(false);
      console.log('Socket disconnected');
    });

    this.socket.on('vehicle:location-update', (data: Telemetry) => {
      this.vehicleLocations.update(locations => {
        const newLocations = new Map(locations);
        newLocations.set(data.vehicleId, data);
        return newLocations;
      });
    });

    this.socket.on('telemetry:alert', (alert: any) => {
      console.log('Alert received:', alert);
    });

    this.socket.connect();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected.set(false);
    }
  }

  joinTrip(tripId: string): void {
    this.socket?.emit('join:trip', { tripId });
  }

  leaveTrip(tripId: string): void {
    this.socket?.emit('leave:trip', { tripId });
  }
}
