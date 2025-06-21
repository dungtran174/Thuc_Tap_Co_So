const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

router.get('/', brandController.getAllBrands);
router.get('/:id', brandController.getBrandById);
router.post('/', authenticateToken, authorizeRole(['admin']), brandController.createBrand);
router.put('/:id', authenticateToken, authorizeRole(['admin']), brandController.updateBrand);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), brandController.deleteBrand);

module.exports = router;