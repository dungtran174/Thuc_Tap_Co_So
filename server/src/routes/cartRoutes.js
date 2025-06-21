const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Tất cả routes đều yêu cầu authentication
router.use(authenticateToken);

// GET /api/cart - Lấy giỏ hàng
router.get('/', cartController.getCart);

// POST /api/cart/add - Thêm sản phẩm vào giỏ hàng
router.post('/add', cartController.addItemToCart);

// PUT /api/cart/update-quantity/:id - Cập nhật số lượng
router.put('/update-quantity/:id', cartController.updateCartItemQuantity);

// DELETE /api/cart/remove/:id - Xóa sản phẩm
router.delete('/remove/:id', cartController.removeCartItem);

// DELETE /api/cart/clear - Xóa toàn bộ giỏ hàng
router.delete('/clear', cartController.clearCart);

module.exports = router;