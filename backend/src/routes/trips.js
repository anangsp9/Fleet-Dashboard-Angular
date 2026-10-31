const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { auth } = require('../middleware/auth');

router.get('/', auth, tripController.getAll);
router.get('/active', auth, tripController.getActiveTrips);
router.get('/:id', auth, tripController.getById);
router.post('/', auth, tripController.create);
router.patch('/:id/status', auth, tripController.updateStatus);
router.delete('/:id', auth, tripController.delete);

module.exports = router;
