const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Alert = sequelize.define('Alert', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('overload', 'speed', 'fuel', 'maintenance', 'deviation'),
    allowNull: false,
  },
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: false,
  },
  vehicleId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  tripId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  acknowledged: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Alert;
