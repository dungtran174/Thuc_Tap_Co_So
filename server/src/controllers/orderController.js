const { 
  Order, 
  OrderDetail, 
  User, 
  UserAddress, 
  OrderStatus, 
  PaymentMethod, 
  PaymentStatus, 
  Shipment, 
  Voucher,
  Product, 
  Color, 
  Size, 
  CartDetail,
  ProductSize,
  ProductColor
} = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../models');

const orderController = {
  // Tạo đơn hàng mới
  async createOrder(req, res) {
    const transaction = await sequelize.transaction();
    
    try {
      const { 
        user_address_id, 
        selected_cart_items, 
        payment_method_id, 
        shipment_id, 
        voucher_code, 
        note 
      } = req.body;
      
      const user_id = req.user.id;

      // Validate input
      if (!user_address_id || !selected_cart_items || !Array.isArray(selected_cart_items) || selected_cart_items.length === 0) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Thông tin đơn hàng không hợp lệ'
        });
      }

      // Lấy thông tin shipment để tính phí vận chuyển
      const shipment = await Shipment.findByPk(shipment_id);
      if (!shipment || shipment.status !== 'active') {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Phương thức vận chuyển không hợp lệ'
        });
      }

      // Lấy thông tin payment method
      const paymentMethod = await PaymentMethod.findByPk(payment_method_id);
      if (!paymentMethod || paymentMethod.status !== 'active') {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Phương thức thanh toán không hợp lệ'
        });
      }

      // Lấy thông tin user address
      const userAddress = await UserAddress.findOne({
        where: { id: user_address_id, user_id }
      });
      if (!userAddress) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Địa chỉ giao hàng không hợp lệ'
        });
      }

      // Tính tổng tiền sản phẩm
      let subtotal = 0;
      const orderItems = [];

      for (const item of selected_cart_items) {
        const cartDetail = await CartDetail.findOne({
          where: { 
            id: item.cart_detail_id,
            cart_id: { [Op.in]: sequelize.literal(`(SELECT id FROM Cart WHERE user_id = ${user_id})`) }
          },
          include: [
            { model: Product, as: 'Product' },
            { model: Color, as: 'Color' },
            { model: Size, as: 'Size' }
          ],
          transaction
        });

        if (!cartDetail) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: `Sản phẩm trong giỏ hàng không tồn tại`
          });
        }

        // Kiểm tra tồn kho trong ProductSize
        const productSize = await ProductSize.findOne({
          where: {
            product_id: cartDetail.product_id,
            size_id: cartDetail.size_id
          },
          transaction
        });

        if (!productSize || productSize.quantity < cartDetail.quantity) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: `Sản phẩm ${cartDetail.Product.name} không đủ hàng trong kho`
          });
        }

        const itemTotal = cartDetail.quantity * cartDetail.unit_price;
        subtotal += itemTotal;

        orderItems.push({
          cart_detail_id: cartDetail.id,
          product_id: cartDetail.product_id,
          color_id: cartDetail.color_id,
          size_id: cartDetail.size_id,
          quantity: cartDetail.quantity,
          unit_price: cartDetail.unit_price,
          total_price: itemTotal
        });
      }

      // Xử lý voucher nếu có
      let discount_amount = 0;
      let voucher = null;
      
      if (voucher_code) {
        voucher = await Voucher.findOne({
          where: {
            code: voucher_code,
            status: 'active',
            start_date: { [Op.lte]: new Date() },
            end_date: { [Op.gte]: new Date() }
          },
          transaction
        });

        if (!voucher) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn'
          });
        }

        // Kiểm tra điều kiện sử dụng voucher
        if (voucher.min_order_amount && subtotal < voucher.min_order_amount) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: `Đơn hàng phải có giá trị tối thiểu ${voucher.min_order_amount.toLocaleString()}₫ để sử dụng mã giảm giá này`
          });
        }

        if (voucher.usage_limit && voucher.used_count >= voucher.usage_limit) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: 'Mã giảm giá đã hết lượt sử dụng'
          });
        }

        // Tính số tiền giảm giá
        if (voucher.discount_type === 'percentage') {
          discount_amount = (subtotal * voucher.discount_value) / 100;
          if (voucher.max_discount_amount && discount_amount > voucher.max_discount_amount) {
            discount_amount = voucher.max_discount_amount;
          }
        } else {
          discount_amount = voucher.discount_value;
        }

        // Cập nhật used_count của voucher
        await voucher.update({ 
          used_count: voucher.used_count + 1 
        }, { transaction });
      }

      // Tính tổng tiền cuối cùng
      const shipping_fee = shipment.price;
      const total_amount = subtotal + shipping_fee - discount_amount;

      // Lấy ID của các status mặc định
      const pendingOrderStatus = await OrderStatus.findOne({
        where: { name: 'Pending' }
      });
      const pendingPaymentStatus = await PaymentStatus.findOne({
        where: { name: 'Pending' }
      });

      // Tạo đơn hàng
      const order = await Order.create({
        user_id,
        user_address_id,
        order_status_id: pendingOrderStatus.id,
        payment_method_id,
        payment_status_id: pendingPaymentStatus.id,
        shipment_id,
        voucher_id: voucher ? voucher.id : null,
        subtotal,
        shipping_fee,
        discount_amount,
        total_amount,
        note,
        order_date: new Date()
      }, { transaction });

      // Tạo order details
      for (const item of orderItems) {
        await OrderDetail.create({
          order_id: order.id,
          product_id: item.product_id,
          color_id: item.color_id,
          size_id: item.size_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price
        }, { transaction });

        // Giảm số lượng tồn kho trong ProductSize
        await ProductSize.decrement('quantity', {
          by: item.quantity,
          where: {
            product_id: item.product_id,
            size_id: item.size_id
          },
          transaction
        });

        // Xóa sản phẩm khỏi giỏ hàng
        await CartDetail.destroy({
          where: { id: item.cart_detail_id },
          transaction
        });
      }

      await transaction.commit();

      // Lấy thông tin đơn hàng đầy đủ
      const orderWithDetails = await Order.findByPk(order.id, {
        include: [
          { model: OrderStatus, as: 'OrderStatus' },
          { model: PaymentMethod, as: 'PaymentMethod' },
          { model: PaymentStatus, as: 'PaymentStatus' },
          { model: Shipment, as: 'Shipment' },
          { model: Voucher, as: 'Voucher' },
          { model: UserAddress, as: 'UserAddress' },
          {
            model: OrderDetail,
            as: 'OrderDetails',
            include: [
              { model: Product, as: 'Product' },
              { model: Color, as: 'Color' },
              { model: Size, as: 'Size' }
            ]
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Đơn hàng đã được tạo thành công',
        order: orderWithDetails
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Error creating order:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi tạo đơn hàng',
        error: error.message
      });
    }
  },

  // Lấy danh sách đơn hàng của user
  async getOrdersByUserId(req, res) {
    try {
      const user_id = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows: orders } = await Order.findAndCountAll({
        where: { user_id },
        include: [
          { model: OrderStatus, as: 'OrderStatus' },
          { model: PaymentMethod, as: 'PaymentMethod' },
          { model: PaymentStatus, as: 'PaymentStatus' },
          { model: Shipment, as: 'Shipment' },
          { model: Voucher, as: 'Voucher' },
          { model: UserAddress, as: 'UserAddress' },
          {
            model: OrderDetail,
            as: 'OrderDetails',
            include: [
              { 
                model: Product, 
                as: 'Product',
                include: [
                  { model: ProductColor, as: 'ProductColors' }
                ]
              },
              { model: Color, as: 'Color' },
              { model: Size, as: 'Size' }
            ]
          }
        ],
        order: [['created_at', 'DESC']],
        limit,
        offset
      });

      res.json({
        success: true,
        orders,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      });

    } catch (error) {
      console.error('Error getting orders:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy danh sách đơn hàng',
        error: error.message
      });
    }
  },

  // Lấy chi tiết đơn hàng
  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;

      const order = await Order.findOne({
        where: { id, user_id },
        include: [
          { model: OrderStatus, as: 'OrderStatus' },
          { model: PaymentMethod, as: 'PaymentMethod' },
          { model: PaymentStatus, as: 'PaymentStatus' },
          { model: Shipment, as: 'Shipment' },
          { model: Voucher, as: 'Voucher' },
          { model: UserAddress, as: 'UserAddress' },
          {
            model: OrderDetail,
            as: 'OrderDetails',
            include: [
              { 
                model: Product, 
                as: 'Product',
                include: [
                  { model: ProductColor, as: 'ProductColors' }
                ]
              },
              { model: Color, as: 'Color' },
              { model: Size, as: 'Size' }
            ]
          }
        ]
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng'
        });
      }

      res.json({
        success: true,
        order
      });

    } catch (error) {
      console.error('Error getting order:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy thông tin đơn hàng',
        error: error.message
      });
    }
  },

  // Hủy đơn hàng
  async cancelOrder(req, res) {
    const transaction = await sequelize.transaction();
    
    try {
      const { id } = req.params;
      const user_id = req.user.id;

      const order = await Order.findOne({
        where: { id, user_id },
        include: [
          { model: OrderStatus, as: 'OrderStatus' },
          { model: OrderDetail, as: 'OrderDetails' }
        ],
        transaction
      });

      if (!order) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng'
        });
      }

      // Kiểm tra trạng thái đơn hàng có thể hủy không
      const cancelableStatuses = ['Pending', 'Confirmed'];
      if (!cancelableStatuses.includes(order.OrderStatus.name)) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Không thể hủy đơn hàng ở trạng thái hiện tại'
        });
      }

      // Hoàn trả số lượng tồn kho
      for (const orderDetail of order.OrderDetails) {
        await ProductSize.increment('quantity', {
          by: orderDetail.quantity,
          where: {
            product_id: orderDetail.product_id,
            size_id: orderDetail.size_id
          },
          transaction
        });
      }

      // Hoàn trả voucher nếu có
      if (order.voucher_id) {
        await Voucher.decrement('used_count', {
          by: 1,
          where: { id: order.voucher_id },
          transaction
        });
      }

      // Cập nhật trạng thái đơn hàng
      const cancelledStatus = await OrderStatus.findOne({
        where: { name: 'Cancelled' }
      });

      await order.update({
        order_status_id: cancelledStatus.id
      }, { transaction });

      await transaction.commit();

      res.json({
        success: true,
        message: 'Đơn hàng đã được hủy thành công'
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Error cancelling order:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi hủy đơn hàng',
        error: error.message
      });
    }
  },

  // VNPAY return endpoint tạm thời để tránh lỗi route undefined
  vnpayReturn(req, res) {
    // TODO: Thực hiện xử lý callback thực tế từ VNPAY ở đây
    return res.json({ success: true, message: 'VNPAY return endpoint' });
  },
  
  // Admin methods
  async getAllOrdersByAdmin(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search = '', 
        order_status_id = '', 
        payment_status_id = '',
        user_id = ''
      } = req.query;
      const offset = (page - 1) * parseInt(limit);

      const where = {};
      if (order_status_id) where.order_status_id = order_status_id;
      if (payment_status_id) where.payment_status_id = payment_status_id;
      if (user_id) where.user_id = user_id;

      const include = [
        {
          model: User,
          attributes: ['id', 'first_name', 'last_name', 'email'],
          where: search ? {
            [Op.or]: [
              { first_name: { [Op.like]: `%${search}%` } },
              { last_name: { [Op.like]: `%${search}%` } },
              { email: { [Op.like]: `%${search}%` } }
            ]
          } : undefined
        },
        {
          model: require('../models').OrderStatus,
          attributes: ['id', 'name']
        },
        {
          model: require('../models').PaymentStatus,
          attributes: ['id', 'name']
        },
        {
          model: require('../models').PaymentMethod,
          attributes: ['id', 'name']
        },
        {
          model: require('../models').Shipment,
          attributes: ['id', 'name', 'price']
        },
        {
          model: OrderDetail,
          include: [{
            model: Product,
            attributes: ['id', 'name', 'image']
          }]
        }
      ];

      const { count, rows } = await Order.findAndCountAll({
        where,
        include,
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset,
        distinct: true
      });

      res.json({
        success: true,
        orders: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error getting orders by admin:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách đơn hàng'
      });
    }
  },

  async updateOrderStatusByAdmin(req, res) {
    try {
      const { id } = req.params;
      const { order_status_id } = req.body;

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng'
        });
      }

      await order.update({ order_status_id });

      const updatedOrder = await Order.findByPk(id, {
        include: [
          { model: require('../models').OrderStatus, attributes: ['name'] }
        ]
      });

      res.json({
        success: true,
        message: 'Cập nhật trạng thái đơn hàng thành công',
        order: updatedOrder
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật trạng thái đơn hàng'
      });
    }
  },

  async updatePaymentStatusByAdmin(req, res) {
    try {
      const { id } = req.params;
      const { payment_status_id } = req.body;

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng'
        });
      }

      await order.update({ payment_status_id });

      const updatedOrder = await Order.findByPk(id, {
        include: [
          { model: require('../models').PaymentStatus, attributes: ['name'] }
        ]
      });

      res.json({
        success: true,
        message: 'Cập nhật trạng thái thanh toán thành công',
        order: updatedOrder
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật trạng thái thanh toán'
      });
    }
  },

  async getOrderDetailsByAdmin(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
          },
          {
            model: require('../models').UserAddress,
            attributes: ['recipient_name', 'recipient_phone', 'address']
          },
          {
            model: require('../models').PaymentMethod,
            attributes: ['id', 'name']
          },
          {
            model: require('../models').Shipment,
            attributes: ['id', 'name', 'price']
          },
          {
            model: require('../models').OrderStatus,
            attributes: ['id', 'name']
          },
          {
            model: require('../models').PaymentStatus,
            attributes: ['id', 'name']
          },
          {
            model: require('../models').Voucher,
            attributes: ['id', 'code', 'name', 'discount_type', 'discount_value']
          },
          {
            model: OrderDetail,
            include: [
              {
                model: Product,
                attributes: ['id', 'name', 'image']
              },
              {
                model: require('../models').Color,
                attributes: ['id', 'name', 'hex_code']
              },
              {
                model: require('../models').Size,
                attributes: ['id', 'name']
              }
            ]
          }
        ]
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng'
        });
      }

      res.json({
        success: true,
        order
      });
    } catch (error) {
      console.error('Error getting order details by admin:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy chi tiết đơn hàng'
      });
    }
  }

};

module.exports = orderController;