const sequelize = require('../config/database');
const User = require('./User');
const Vehicle = require('./Vehicle');
const Driver = require('./Driver');
const Trip = require('./Trip');
const Telemetry = require('./Telemetry');
const Alert = require('./Alert');

// Associations
Driver.belongsTo(Vehicle, { foreignKey: 'assignedVehicleId', as: 'vehicle' });
Vehicle.hasOne(Driver, { foreignKey: 'assignedVehicleId', as: 'driver' });

Trip.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
Vehicle.hasMany(Trip, { foreignKey: 'vehicleId', as: 'trips' });

Trip.belongsTo(Driver, { foreignKey: 'driverId', as: 'driver' });
Driver.hasMany(Trip, { foreignKey: 'driverId', as: 'trips' });

Telemetry.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });
Trip.hasMany(Telemetry, { foreignKey: 'tripId', as: 'telemetries' });

Telemetry.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
Vehicle.hasMany(Telemetry, { foreignKey: 'vehicleId', as: 'telemetries' });

Alert.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
Vehicle.hasMany(Alert, { foreignKey: 'vehicleId', as: 'alerts' });

Alert.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });
Trip.hasMany(Alert, { foreignKey: 'tripId', as: 'alerts' });

module.exports = {
  sequelize,
  User,
  Vehicle,
  Driver,
  Trip,
  Telemetry,
  Alert,
};
