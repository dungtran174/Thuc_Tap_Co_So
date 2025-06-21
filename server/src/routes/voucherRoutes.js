const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');

// Áp dụng voucher
router.post('/apply', voucherController.applyVoucher);

// Lấy danh sách voucher có thể sử dụng
router.get('/available', voucherController.getAvailableVouchers);

module.exports = router;