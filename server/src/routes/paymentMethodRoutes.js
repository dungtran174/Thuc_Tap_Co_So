const express = require('express');
const router = express.Router();
const paymentMethodController = require('../controllers/paymentMethodController');

// Lấy tất cả phương thức thanh toán
router.get('/', paymentMethodController.getAllPaymentMethods);

module.exports = router;