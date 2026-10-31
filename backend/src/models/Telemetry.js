const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Telemetry = sequelize.define('Telemetry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tripId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  vehicleId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  speed: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  heading: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  fuelLevel: {
    type: DataTypes.FLOAT,
    defaultValue: 100,
  },
  fuelConsumption: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  engineTemp: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  tirePressure: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Telemetry;
