const { Order, PaymentStatus, PaymentMethod } = require('../models');

// Mock VNPay cho demo - Không cần config thật
class MockVNPayService {
  // Tạo mock payment URL
  createMockPaymentUrl(order) {
    // Tạo mock URL redirect đến trang giả lập VNPay
    const mockParams = {
      orderId: order.id,
      amount: Math.round(order.total_amount),
      orderInfo: `Thanh toan don hang ${order.id}`,
      returnUrl: 'http://localhost:5173/payment/vnpay-return'
    };

    const queryString = new URLSearchParams(mockParams).toString();
    const mockPaymentUrl = `http://localhost:5173/payment/vnpay-mock?${queryString}`;
    
    console.log('🎭 Mock Payment URL:', mockPaymentUrl);
    return mockPaymentUrl;
  }

  // Simulate VNPay return data
  generateMockReturnData(orderId, success = true) {
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    
    return {
      vnp_Amount: '10000000', // Mock amount
      vnp_BankCode: 'NCB',
      vnp_CardType: 'ATM',
      vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
      vnp_PayDate: timestamp,
      vnp_ResponseCode: success ? '00' : '01', // 00 = success, 01 = fail
      vnp_TmnCode: 'DEMOMOCK',
      vnp_TransactionNo: `MOCK${Date.now()}`,
      vnp_TxnRef: `${orderId}_${Date.now()}`,
      vnp_SecureHash: 'mock_secure_hash'
    };
  }
}

const mockVNPayService = new MockVNPayService();

const paymentController = {
  // Tạo mock payment URL
  async createVNPayPayment(req, res) {
    try {
      const { orderId } = req.body;
      
      console.log('🎭 Creating MOCK VNPay payment for order:', orderId);

      const order = await Order.findByPk(orderId, {
        include: [{ model: PaymentStatus, as: 'PaymentStatus' }]
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng'
        });
      }

      if (order.PaymentStatus?.name === 'Paid') {
        return res.status(400).json({
          success: false,
          message: 'Đơn hàng đã được thanh toán'
        });
      }

      // Cập nhật payment method thành VNPay
      const vnpayMethod = await PaymentMethod.findOne({ where: { name: 'VNPay' } });
      if (vnpayMethod) {
        await order.update({ payment_method_id: vnpayMethod.id });
      }

      // Tạo mock payment URL
      const paymentUrl = mockVNPayService.createMockPaymentUrl(order);

      res.json({
        success: true,
        paymentUrl,
        isMock: true // Đánh dấu là mock để frontend biết
      });

    } catch (error) {
      console.error('❌ Error creating mock VNPay payment:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi tạo thanh toán VNPay',
        error: error.message
      });
    }
  },

  // Xử lý mock return từ VNPay
  async handleVNPayReturn(req, res) {
    try {
      const { orderId, success = 'true' } = req.query;
      
      console.log('🔄 Mock VNPay return:', { orderId, success });
      
      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin đơn hàng'
        });
      }

      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng'
        });
      }

      const isSuccess = success === 'true';
      const mockReturnData = mockVNPayService.generateMockReturnData(orderId, isSuccess);

      // Cập nhật order status
      if (isSuccess) {
        const paidStatus = await PaymentStatus.findOne({ where: { name: 'Paid' } });
        if (paidStatus) {
          await order.update({ 
            payment_status_id: paidStatus.id,
            vnpay_transaction_ref: mockReturnData.vnp_TxnRef,
            vnpay_response_code: mockReturnData.vnp_ResponseCode,
            vnpay_transaction_no: mockReturnData.vnp_TransactionNo,
            vnpay_pay_date: mockReturnData.vnp_PayDate
          });
        }
      }

      res.json({
        success: isSuccess,
        message: isSuccess ? 'Thanh toán thành công (Demo)' : 'Thanh toán thất bại (Demo)',
        orderId: parseInt(orderId),
        amount: order.total_amount,
        responseCode: mockReturnData.vnp_ResponseCode,
        isMock: true
      });

    } catch (error) {
      console.error('❌ Error handling mock VNPay return:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi xử lý kết quả thanh toán',
        error: error.message
      });
    }
  }
};

module.exports = paymentController;