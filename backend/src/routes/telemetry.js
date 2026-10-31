const express = require('express');
const router = express.Router();
const telemetryController = require('../controllers/telemetryController');
const { auth } = require('../middleware/auth');

router.get('/', auth, telemetryController.getAll);
router.get('/trip/:tripId', auth, telemetryController.getByTrip);
router.get('/vehicle/:vehicleId', auth, telemetryController.getLatestByVehicle);
router.post('/', auth, telemetryController.create);

module.exports = router;
