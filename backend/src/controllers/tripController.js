const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Telemetry = require('../models/Telemetry');

exports.getAll = async (req, res) => {
  try {
    const { status, vehicleId, driverId } = req.query;
    const where = {};

    if (status) where.status = status;
    if (vehicleId) where.vehicleId = vehicleId;
    if (driverId) where.driverId = driverId;

    const trips = await Trip.findAll({
      where,
      include: [
        { model: Vehicle, as: 'vehicle', attributes: ['id', 'plate', 'type', 'brand', 'model'] },
        { model: Driver, as: 'driver', attributes: ['id', 'name', 'phone'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id, {
      include: [
        { model: Vehicle, as: 'vehicle' },
        { model: Driver, as: 'driver' },
        { model: Telemetry, as: 'telemetries', order: [['timestamp', 'DESC']], limit: 10 },
      ],
    });
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const trip = await Trip.create(req.body);

    // Update vehicle and driver status
    await Vehicle.update({ status: 'active' }, { where: { id: req.body.vehicleId } });
    await Driver.update({ status: 'on-trip' }, { where: { id: req.body.driverId } });

    res.status(201).json(trip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const { status } = req.body;
    const updateData = { status };

    if (status === 'in-transit' && !trip.startTime) {
      updateData.startTime = new Date();
    } else if (status === 'completed' || status === 'cancelled') {
      updateData.endTime = new Date();

      // Update vehicle and driver status
      await Vehicle.update({ status: 'idle' }, { where: { id: trip.vehicleId } });
      await Driver.update({ status: 'available' }, { where: { id: trip.driverId } });
    }

    await trip.update(updateData);
    res.json(trip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    await trip.destroy();
    res.json({ message: 'Trip deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getActiveTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll({
      where: { status: ['in-transit', 'delayed'] },
      include: [
        { model: Vehicle, as: 'vehicle', attributes: ['id', 'plate', 'type', 'brand', 'model', 'fuelLevel'] },
        { model: Driver, as: 'driver', attributes: ['id', 'name', 'phone'] },
      ],
      order: [['startTime', 'DESC']],
    });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
