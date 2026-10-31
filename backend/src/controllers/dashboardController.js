const { Op } = require('sequelize');
const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const Driver = require('../models/Driver');
const Alert = require('../models/Alert');

exports.getStats = async (req, res) => {
  try {
    const totalVehicles = await Vehicle.count();
    const activeVehicles = await Vehicle.count({ where: { status: 'active' } });
    const totalTrips = await Trip.count();
    const activeTrips = await Trip.count({ where: { status: 'in-transit' } });
    const completedTrips = await Trip.count({ where: { status: 'completed' } });
    const delayedTrips = await Trip.count({ where: { status: 'delayed' } });
    const pendingTrips = await Trip.count({ where: { status: 'pending' } });
    const totalDrivers = await Driver.count();
    const availableDrivers = await Driver.count({ where: { status: 'available' } });
    const alertsCount = await Alert.count({ where: { acknowledged: false } });

    // Calculate average efficiency (mock calculation)
    const avgEfficiency = 87.5;

    res.json({
      totalVehicles,
      activeVehicles,
      totalTrips,
      activeTrips,
      completedTrips,
      delayedTrips,
      pendingTrips,
      totalDrivers,
      availableDrivers,
      alertsCount,
      avgEfficiency,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFleetStatus = async (req, res) => {
  try {
    const statusCounts = await Vehicle.findAll({
      attributes: [
        'status',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
      ],
      group: ['status'],
    });

    const statusMap = {
      active: 0,
      idle: 0,
      maintenance: 0,
      offline: 0,
    };

    statusCounts.forEach((item) => {
      statusMap[item.status] = parseInt(item.dataValues.count);
    });

    res.json(statusMap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const recentTrips = await Trip.findAll({
      include: [
        { model: Vehicle, as: 'vehicle', attributes: ['plate', 'type'] },
        { model: Driver, as: 'driver', attributes: ['name'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    res.json(recentTrips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
