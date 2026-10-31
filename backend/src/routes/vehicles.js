const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { auth } = require('../middleware/auth');

router.get('/', auth, vehicleController.getAll);
router.get('/:id', auth, vehicleController.getById);
router.post('/', auth, vehicleController.create);
router.put('/:id', auth, vehicleController.update);
router.delete('/:id', auth, vehicleController.delete);
router.patch('/:id/status', auth, vehicleController.updateStatus);

module.exports = router;
