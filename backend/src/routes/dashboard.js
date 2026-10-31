const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { auth } = require('../middleware/auth');

router.get('/stats', auth, dashboardController.getStats);
router.get('/fleet-status', auth, dashboardController.getFleetStatus);
router.get('/recent-activity', auth, dashboardController.getRecentActivity);

module.exports = router;
