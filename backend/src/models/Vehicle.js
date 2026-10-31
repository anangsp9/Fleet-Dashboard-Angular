const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  plate: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.ENUM('truck', 'van', 'trailer'),
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Capacity in kg',
  },
  weightLimit: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Weight limit in kg',
  },
  dimensions: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: { length: 0, width: 0, height: 0 },
  },
  status: {
    type: DataTypes.ENUM('active', 'idle', 'maintenance', 'offline'),
    defaultValue: 'idle',
  },
  fuelLevel: {
    type: DataTypes.FLOAT,
    defaultValue: 100,
    validate: { min: 0, max: 100 },
  },
  mileage: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  lastService: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
});

module.exports = Vehicle;
