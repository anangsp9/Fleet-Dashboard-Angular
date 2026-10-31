const { sequelize, User, Vehicle, Driver, Trip, Telemetry, Alert } = require('../models');
require('dotenv').config();

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync({ force: true });
    console.log('Database synced (force)');

    // Create admin user
    const admin = await User.create({
      name: 'Admin Fleet',
      email: 'admin@fleet.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Admin user created');

    // Create vehicles
    const vehicles = await Vehicle.bulkCreate([
      {
        plate: 'B 1234 CD', type: 'truck', brand: 'Mitsubishi', model: 'Fuso Canter', year: 2022,
        capacity: 8000, weightLimit: 10000, dimensions: { length: 6.5, width: 2.2, height: 2.8 },
        status: 'active', fuelLevel: 75, mileage: 45230, lastService: '2026-08-15',
      },
      {
        plate: 'B 5678 EF', type: 'trailer', brand: 'Hino', model: 'FL 235', year: 2023,
        capacity: 15000, weightLimit: 20000, dimensions: { length: 9.2, width: 2.4, height: 3.2 },
        status: 'active', fuelLevel: 60, mileage: 28100, lastService: '2026-09-01',
      },
      {
        plate: 'B 9012 GH', type: 'van', brand: 'Toyota', model: 'HiAce', year: 2024,
        capacity: 2000, weightLimit: 3000, dimensions: { length: 4.8, width: 1.8, height: 2.2 },
        status: 'idle', fuelLevel: 90, mileage: 12500, lastService: '2026-09-10',
      },
      {
        plate: 'B 3456 IJ', type: 'truck', brand: 'Isuzu', model: 'NPR 75', year: 2021,
        capacity: 6000, weightLimit: 7500, dimensions: { length: 5.8, width: 2.0, height: 2.5 },
        status: 'maintenance', fuelLevel: 30, mileage: 67800, lastService: '2026-09-15',
      },
      {
        plate: 'B 7890 KL', type: 'trailer', brand: 'Mitsubishi', model: 'Fuso Fighter', year: 2023,
        capacity: 20000, weightLimit: 25000, dimensions: { length: 10.5, width: 2.5, height: 3.5 },
        status: 'active', fuelLevel: 45, mileage: 34200, lastService: '2026-08-28',
      },
      {
        plate: 'B 2345 MN', type: 'van', brand: 'Suzuki', model: 'APV', year: 2022,
        capacity: 1500, weightLimit: 2000, dimensions: { length: 4.2, width: 1.6, height: 1.9 },
        status: 'active', fuelLevel: 85, mileage: 23400, lastService: '2026-09-05',
      },
      {
        plate: 'B 6789 OP', type: 'truck', brand: 'Hino', model: 'Dutro 130', year: 2024,
        capacity: 5000, weightLimit: 6500, dimensions: { length: 5.2, width: 1.9, height: 2.4 },
        status: 'offline', fuelLevel: 0, mileage: 8900, lastService: '2026-09-12',
      },
      {
        plate: 'B 4567 QR', type: 'trailer', brand: 'Scania', model: 'P 410', year: 2023,
        capacity: 25000, weightLimit: 30000, dimensions: { length: 12.0, width: 2.5, height: 3.8 },
        status: 'active', fuelLevel: 55, mileage: 19800, lastService: '2026-09-08',
      },
    ]);
    console.log('Vehicles created');

    // Create drivers
    const drivers = await Driver.bulkCreate([
      { name: 'Budi Santoso', license: 'SIM-A-001', phone: '081234567890', email: 'budi@email.com', status: 'on-trip', assignedVehicleId: vehicles[0].id },
      { name: 'Andi Wijaya', license: 'SIM-A-002', phone: '082345678901', email: 'andi@email.com', status: 'on-trip', assignedVehicleId: vehicles[1].id },
      { name: 'Dedi Kurniawan', license: 'SIM-A-003', phone: '083456789012', email: 'dedi@email.com', status: 'available', assignedVehicleId: vehicles[2].id },
      { name: 'Rizki Pratama', license: 'SIM-A-004', phone: '084567890123', email: 'rizki@email.com', status: 'on-trip', assignedVehicleId: vehicles[4].id },
      { name: 'Eko Saputra', license: 'SIM-A-005', phone: '085678901234', email: 'eko@email.com', status: 'available', assignedVehicleId: vehicles[5].id },
      { name: 'Agus Setiawan', license: 'SIM-A-006', phone: '086789012345', email: 'agus@email.com', status: 'on-trip', assignedVehicleId: vehicles[7].id },
      { name: 'Fajar Nugroho', license: 'SIM-A-007', phone: '087890123456', email: 'fajar@email.com', status: 'off-duty' },
    ]);
    console.log('Drivers created');

    // Create trips
    const trips = await Trip.bulkCreate([
      {
        vehicleId: vehicles[0].id, driverId: drivers[0].id,
        origin: 'Jakarta', destination: 'Bandung',
        originCoords: { lat: -6.2088, lng: 106.8456 }, destinationCoords: { lat: -6.9175, lng: 107.6191 },
        status: 'in-transit', startTime: '2026-09-17T06:00:00', eta: '2026-09-17T10:30:00',
        distance: 150, loadWeight: 7500, loadDimensions: { length: 6.0, width: 2.0, height: 2.5 },
        isOverload: false, isOverDimension: false,
      },
      {
        vehicleId: vehicles[1].id, driverId: drivers[1].id,
        origin: 'Surabaya', destination: 'Semarang',
        originCoords: { lat: -7.2575, lng: 112.7521 }, destinationCoords: { lat: -6.9666, lng: 110.4196 },
        status: 'in-transit', startTime: '2026-09-17T05:30:00', eta: '2026-09-17T11:00:00',
        distance: 320, loadWeight: 18000, loadDimensions: { length: 8.5, width: 2.3, height: 3.0 },
        isOverload: false, isOverDimension: false,
      },
      {
        vehicleId: vehicles[4].id, driverId: drivers[3].id,
        origin: 'Medan', destination: 'Padang',
        originCoords: { lat: 3.5952, lng: 98.6722 }, destinationCoords: { lat: -0.9471, lng: 100.4172 },
        status: 'delayed', startTime: '2026-09-17T04:00:00', eta: '2026-09-17T16:00:00',
        distance: 480, loadWeight: 22000, loadDimensions: { length: 10.0, width: 2.4, height: 3.3 },
        isOverload: true, isOverDimension: false,
      },
      {
        vehicleId: vehicles[7].id, driverId: drivers[5].id,
        origin: 'Yogyakarta', destination: 'Malang',
        originCoords: { lat: -7.7956, lng: 110.3695 }, destinationCoords: { lat: -7.9666, lng: 112.6326 },
        status: 'completed', startTime: '2026-09-16T08:00:00', endTime: '2026-09-16T14:30:00',
        distance: 280, loadWeight: 28000, loadDimensions: { length: 11.5, width: 2.4, height: 3.5 },
        isOverload: false, isOverDimension: true,
      },
      {
        vehicleId: vehicles[5].id, driverId: drivers[4].id,
        origin: 'Bandung', destination: 'Bekasi',
        originCoords: { lat: -6.9175, lng: 107.6191 }, destinationCoords: { lat: -6.2349, lng: 106.9896 },
        status: 'pending', distance: 120, loadWeight: 1200,
        loadDimensions: { length: 3.5, width: 1.5, height: 1.8 },
        isOverload: false, isOverDimension: false,
      },
    ]);
    console.log('Trips created');

    // Create telemetry data
    await Telemetry.bulkCreate([
      { tripId: trips[0].id, vehicleId: vehicles[0].id, latitude: -6.5, longitude: 107.2, speed: 65, heading: 180, fuelLevel: 72, fuelConsumption: 12.5, engineTemp: 85, tirePressure: 32, timestamp: '2026-09-17T08:30:00' },
      { tripId: trips[0].id, vehicleId: vehicles[0].id, latitude: -6.6, longitude: 107.4, speed: 70, heading: 175, fuelLevel: 70, fuelConsumption: 13.0, engineTemp: 87, tirePressure: 31, timestamp: '2026-09-17T08:45:00' },
      { tripId: trips[1].id, vehicleId: vehicles[1].id, latitude: -7.1, longitude: 112.5, speed: 55, heading: 270, fuelLevel: 58, fuelConsumption: 18.2, engineTemp: 90, tirePressure: 35, timestamp: '2026-09-17T08:30:00' },
      { tripId: trips[2].id, vehicleId: vehicles[4].id, latitude: 2.8, longitude: 99.5, speed: 45, heading: 200, fuelLevel: 42, fuelConsumption: 22.0, engineTemp: 92, tirePressure: 38, timestamp: '2026-09-17T08:30:00' },
      { tripId: trips[3].id, vehicleId: vehicles[7].id, latitude: -7.9, longitude: 111.5, speed: 0, heading: 0, fuelLevel: 55, fuelConsumption: 0, engineTemp: 30, tirePressure: 33, timestamp: '2026-09-16T14:30:00' },
    ]);
    console.log('Telemetry data created');

    // Create alerts
    await Alert.bulkCreate([
      { type: 'overload', severity: 'high', vehicleId: vehicles[4].id, tripId: trips[2].id, message: 'Vehicle overloaded: 22000kg / 20000kg limit', timestamp: '2026-09-17T04:15:00', acknowledged: false },
      { type: 'speed', severity: 'medium', vehicleId: vehicles[1].id, tripId: trips[1].id, message: 'Speed exceeded 80km/h on highway', timestamp: '2026-09-17T07:20:00', acknowledged: false },
      { type: 'fuel', severity: 'low', vehicleId: vehicles[3].id, message: 'Fuel level below 30%', timestamp: '2026-09-17T06:00:00', acknowledged: true },
      { type: 'maintenance', severity: 'medium', vehicleId: vehicles[3].id, message: 'Scheduled maintenance overdue', timestamp: '2026-09-15T08:00:00', acknowledged: false },
      { type: 'deviation', severity: 'high', vehicleId: vehicles[0].id, tripId: trips[0].id, message: 'Route deviation detected', timestamp: '2026-09-17T08:00:00', acknowledged: false },
    ]);
    console.log('Alerts created');

    console.log('\n✅ Seed completed successfully!');
    console.log('\nLogin credentials:');
    console.log('Email: admin@fleet.com');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
