const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  vehicleId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  driverId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  origin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  originCoords: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: { lat: 0, lng: 0 },
  },
  destinationCoords: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: { lat: 0, lng: 0 },
  },
  status: {
    type: DataTypes.ENUM('pending', 'in-transit', 'completed', 'delayed', 'cancelled'),
    defaultValue: 'pending',
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  eta: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  distance: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Distance in km',
  },
  loadWeight: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Load weight in kg',
  },
  loadDimensions: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: { length: 0, width: 0, height: 0 },
  },
  isOverload: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isOverDimension: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Trip;
