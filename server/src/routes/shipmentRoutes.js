const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');

// Lấy tất cả phương thức vận chuyển
router.get('/', shipmentController.getAllShipments);

module.exports = router;