const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Tạo thanh toán VNPay
router.post('/vnpay/create', authenticateToken, paymentController.createVNPayPayment);

// Return URL từ VNPay
router.get('/vnpay/return', paymentController.handleVNPayReturn);

// TEST endpoint để kiểm tra config
router.get('/vnpay/test', (req, res) => {
  res.json({
    success: true,
    config: {
      tmnCode: 'DEMOV210',
      url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
      returnUrl: 'http://localhost:5173/payment/vnpay-return'
    },
    sampleUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=10000000&vnp_Command=pay&vnp_CreateDate=20250526103000&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Test+Payment&vnp_OrderType=other&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A5173%2Fpayment%2Fvnpay-return&vnp_TmnCode=DEMOV210&vnp_TxnRef=TEST123&vnp_Version=2.1.0&vnp_SecureHash=sample'
  });
});

module.exports = router;