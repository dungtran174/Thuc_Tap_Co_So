const express = require('express');
const router = express.Router();
const userAddressController = require('../controllers/userAddressController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, userAddressController.getUserAddresses);
router.post('/', authenticateToken, userAddressController.addUserAddress);
router.put('/:id', authenticateToken, userAddressController.updateUserAddress);
router.delete('/:id', authenticateToken, userAddressController.deleteUserAddress);
router.put('/:id/set-default', authenticateToken, userAddressController.setDefaultUserAddress);

module.exports = router;