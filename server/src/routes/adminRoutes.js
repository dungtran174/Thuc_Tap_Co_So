const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

// Controllers
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');
const categoryController = require('../controllers/categoryController');
const brandController = require('../controllers/brandController');
const productController = require('../controllers/productController');
const voucherController = require('../controllers/voucherController');
const orderController = require('../controllers/orderController');
const shipmentController = require('../controllers/shipmentController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });
// Apply admin authentication to all routes
router.use(authenticateToken);
router.use(authorizeRole(['admin']));

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);

// User Management
router.get('/users', userController.getAllUsersByAdmin);
router.post('/users', userController.createUserByAdmin);
router.get('/users/:id', userController.getUserDetailsByAdmin);
router.put('/users/:id', userController.updateUserByAdmin);
router.delete('/users/:id', userController.deleteUserByAdmin);
router.get('/users/stats', userController.getUserStatsForAdmin);

// Category Management
router.get('/categories', categoryController.getAllCategories);
router.post('/categories', categoryController.createCategory);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

// Brand Management
router.get('/brands', brandController.getAllBrands);
router.post('/brands', brandController.createBrand);
router.put('/brands/:id', brandController.updateBrand);
router.delete('/brands/:id', brandController.deleteBrand);

// Product Management
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductDetails);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

// Product Support Routes
router.get('/categories', productController.getCategories);
router.get('/brands', productController.getBrands);
router.get('/colors', productController.getColors);
router.get('/sizes', productController.getSizes);

// Product Image Upload
router.post('/products/upload-image', upload.single('image'), productController.uploadImage);

// Voucher Management
router.get('/vouchers', voucherController.getAllVouchersByAdmin);
router.post('/vouchers', voucherController.createVoucher);
router.put('/vouchers/:id', voucherController.updateVoucher);
router.delete('/vouchers/:id', voucherController.deleteVoucher);

// Order Management
router.get('/orders', adminController.getAllOrders);
router.get('/orders/:id', adminController.getOrderDetails);
router.put('/orders/:id/status', adminController.updateOrderStatus);
router.put('/orders/:id/payment-status', adminController.updatePaymentStatus);

// Shipment Management
router.get('/shipments', shipmentController.getAllShipmentsByAdmin);
router.post('/shipments', shipmentController.createShipment);
router.put('/shipments/:id', shipmentController.updateShipment);
router.delete('/shipments/:id', shipmentController.deleteShipment);

module.exports = router;