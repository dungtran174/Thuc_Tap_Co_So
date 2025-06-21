const { PaymentMethod } = require('../models');

const paymentMethodController = {
  async getAllPaymentMethods(req, res) {
    try {
      const paymentMethods = await PaymentMethod.findAll({
        where: { status: 'active' },
        order: [['id', 'ASC']]
      });

      res.json({
        success: true,
        payment_methods: paymentMethods
      });

    } catch (error) {
      console.error('Error getting payment methods:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy danh sách phương thức thanh toán',
        error: error.message
      });
    }
  }
};

module.exports = paymentMethodController;