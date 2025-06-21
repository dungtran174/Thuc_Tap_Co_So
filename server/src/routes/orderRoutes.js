const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Tạo đơn hàng mới
router.post('/', authenticateToken, orderController.createOrder);

// Lấy danh sách đơn hàng của user hiện tại
router.get('/me', authenticateToken, orderController.getOrdersByUserId);

// Lấy chi tiết đơn hàng
router.get('/:id', authenticateToken, orderController.getOrderById);

// Hủy đơn hàng
router.put('/:id/cancel', authenticateToken, orderController.cancelOrder);

// VNPAY return URL
router.get('/vnpay/return', orderController.vnpayReturn);

module.exports = router;