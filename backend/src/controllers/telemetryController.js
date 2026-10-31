const Telemetry = require('../models/Telemetry');
const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Alert = require('../models/Alert');

exports.getAll = async (req, res) => {
  try {
    const { tripId, vehicleId } = req.query;
    const where = {};

    if (tripId) where.tripId = tripId;
    if (vehicleId) where.vehicleId = vehicleId;

    const telemetry = await Telemetry.findAll({
      where,
      order: [['timestamp', 'DESC']],
      limit: 100,
    });
    res.json(telemetry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByTrip = async (req, res) => {
  try {
    const telemetry = await Telemetry.findAll({
      where: { tripId: req.params.tripId },
      order: [['timestamp', 'ASC']],
    });
    res.json(telemetry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const telemetry = await Telemetry.create(req.body);

    // Check for alerts
    const vehicle = await Vehicle.findByPk(req.body.vehicleId);
    if (vehicle) {
      // Update fuel level
      await vehicle.update({ fuelLevel: req.body.fuelLevel });

      // Check speed alert
      if (req.body.speed > 100) {
        await Alert.create({
          type: 'speed',
          severity: 'high',
          vehicleId: req.body.vehicleId,
          tripId: req.body.tripId,
          message: `Speed exceeded 100km/h: ${req.body.speed.toFixed(0)}km/h`,
          timestamp: new Date(),
        });
      }

      // Check fuel alert
      if (req.body.fuelLevel < 20) {
        await Alert.create({
          type: 'fuel',
          severity: req.body.fuelLevel < 10 ? 'critical' : 'medium',
          vehicleId: req.body.vehicleId,
          tripId: req.body.tripId,
          message: `Fuel level low: ${req.body.fuelLevel.toFixed(0)}%`,
          timestamp: new Date(),
        });
      }

      // Check engine temperature
      if (req.body.engineTemp > 100) {
        await Alert.create({
          type: 'maintenance',
          severity: 'high',
          vehicleId: req.body.vehicleId,
          tripId: req.body.tripId,
          message: `Engine temperature high: ${req.body.engineTemp.toFixed(0)}°C`,
          timestamp: new Date(),
        });
      }
    }

    res.status(201).json(telemetry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getLatestByVehicle = async (req, res) => {
  try {
    const telemetry = await Telemetry.findOne({
      where: { vehicleId: req.params.vehicleId },
      order: [['timestamp', 'DESC']],
    });
    res.json(telemetry || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
