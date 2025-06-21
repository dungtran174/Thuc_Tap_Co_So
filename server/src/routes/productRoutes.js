const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// ========== PUBLIC ROUTES (Frontend User) ==========
// ⚠️ Đặt routes cụ thể TRƯỚC routes dynamic (:id)

// Special endpoints - phải đặt trước /:id
router.get('/best-selling', productController.getBestSellingProducts);
router.get('/newest', productController.getNewestProducts);
router.get('/featured', productController.getFeaturedProducts);

// Main products endpoint (for ProductListPage with filters)
router.get('/', productController.getProducts);

// Single product (đặt cuối cùng)
router.get('/:id', productController.getProductById);

// ========== ADMIN ROUTES ==========
// Sử dụng prefix /admin để tránh conflict
router.get('/admin/all', authenticateToken, authorizeRole(['admin']), productController.getAllProducts);
router.get('/admin/:id/details', authenticateToken, authorizeRole(['admin']), productController.getProductDetails);

router.post('/admin', authenticateToken, authorizeRole(['admin']), upload.array('colorImages'), productController.createProduct);
router.put('/admin/:id', authenticateToken, authorizeRole(['admin']), upload.array('colorImages'), productController.updateProduct);
router.delete('/admin/:id', authenticateToken, authorizeRole(['admin']), productController.deleteProduct);

// Utility routes
router.post('/admin/upload-image', authenticateToken, authorizeRole(['admin']), upload.single('image'), productController.uploadImage);

module.exports = router;