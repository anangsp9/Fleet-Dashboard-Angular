const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');

exports.getAll = async (req, res) => {
  try {
    const drivers = await Driver.findAll({
      include: [{ model: Vehicle, as: 'vehicle' }],
      order: [['createdAt', 'DESC']],
    });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id, {
      include: [{ model: Vehicle, as: 'vehicle' }],
    });
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const driver = await Driver.create(req.body);
    res.status(201).json(driver);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    await driver.update(req.body);
    res.json(driver);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    await driver.destroy();
    res.json({ message: 'Driver deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
