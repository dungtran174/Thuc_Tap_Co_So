const { Voucher } = require('../models');
const { Op } = require('sequelize');

const voucherController = {
  // Áp dụng voucher
  async applyVoucher(req, res) {
    try {
      const { code, subtotal } = req.body;

      if (!code || subtotal === undefined || subtotal === null) {
        return res.status(400).json({
          success: false,
          message: 'Mã voucher và tổng tiền đơn hàng là bắt buộc'
        });
      }

      const voucher = await Voucher.findOne({
        where: {
          code: code.toUpperCase(),
          status: 'active',
          start_date: { [Op.lte]: new Date() },
          end_date: { [Op.gte]: new Date() }
        }
      });

      if (!voucher) {
        return res.status(404).json({
          success: false,
          message: 'Mã voucher không hợp lệ hoặc đã hết hạn'
        });
      }

      // Kiểm tra điều kiện đơn hàng tối thiểu
      if (voucher.min_order_amount && subtotal < voucher.min_order_amount) {
        return res.status(400).json({
          success: false,
          message: `Đơn hàng phải có giá trị tối thiểu ${voucher.min_order_amount.toLocaleString()}₫ để sử dụng mã giảm giá này`
        });
      }

      // Kiểm tra giới hạn sử dụng
      if (voucher.usage_limit && voucher.used_count >= voucher.usage_limit) {
        return res.status(400).json({
          success: false,
          message: 'Mã voucher đã hết lượt sử dụng'
        });
      }

      // Tính số tiền giảm giá
      let discount_amount = 0;
      if (voucher.discount_type === 'percentage') {
        discount_amount = (subtotal * voucher.discount_value) / 100;
        if (voucher.max_discount_amount && discount_amount > voucher.max_discount_amount) {
          discount_amount = voucher.max_discount_amount;
        }
      } else {
        discount_amount = voucher.discount_value;
        if (discount_amount > subtotal) {
          discount_amount = subtotal;
        }
      }

      res.json({
        success: true,
        message: 'Áp dụng mã voucher thành công',
        voucher: {
          id: voucher.id,
          code: voucher.code,
          name: voucher.name,
          discount_type: voucher.discount_type,
          discount_value: voucher.discount_value,
          discount_amount: parseFloat(discount_amount.toFixed(2))
        }
      });

    } catch (error) {
      console.error('Error applying voucher:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi áp dụng mã voucher',
        error: error.message
      });
    }
  },

  // Lấy danh sách voucher có thể sử dụng
  async getAvailableVouchers(req, res) {
    try {
      const { subtotal } = req.query;

      const whereCondition = {
        status: 'active',
        start_date: { [Op.lte]: new Date() },
        end_date: { [Op.gte]: new Date() },
        [Op.or]: [
          { usage_limit: null },
          sequelize.where(
            sequelize.col('used_count'),
            { [Op.lt]: sequelize.col('usage_limit') }
          )
        ]
      };

      if (subtotal) {
        whereCondition.min_order_amount = { [Op.lte]: subtotal };
      }

      const vouchers = await Voucher.findAll({
        where: whereCondition,
        order: [['discount_value', 'DESC']]
      });

      res.json({
        success: true,
        vouchers
      });

    } catch (error) {
      console.error('Error getting available vouchers:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy danh sách voucher',
        error: error.message
      });
    }
  },

  // Admin methods
  async getAllVouchersByAdmin(req, res) {
    try {
      const { page = 1, limit = 10, search = '', status = '' } = req.query;
      const offset = (page - 1) * parseInt(limit);

      const where = {};
      if (search) {
        where[Op.or] = [
          { code: { [Op.like]: `%${search}%` } },
          { name: { [Op.like]: `%${search}%` } }
        ];
      }
      if (status) {
        where.status = status;
      }

      const { count, rows } = await Voucher.findAndCountAll({
        where,
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset
      });

      res.json({
        success: true,
        vouchers: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error getting vouchers by admin:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách voucher'
      });
    }
  },

  async createVoucher(req, res) {
    try {
      const {
        code,
        name,
        description,
        discount_type,
        discount_value,
        min_order_amount,
        max_discount_amount,
        usage_limit,
        start_date,
        end_date
      } = req.body;

      // Check if code already exists
      const existingVoucher = await Voucher.findOne({ where: { code: code.toUpperCase() } });
      if (existingVoucher) {
        return res.status(400).json({
          success: false,
          message: 'Mã voucher đã tồn tại'
        });
      }

      const voucher = await Voucher.create({
        code: code.toUpperCase(),
        name,
        description,
        discount_type,
        discount_value,
        min_order_amount: min_order_amount || 0,
        max_discount_amount,
        usage_limit,
        start_date,
        end_date,
        status: 'active'
      });

      res.status(201).json({
        success: true,
        message: 'Tạo voucher thành công',
        voucher
      });
    } catch (error) {
      console.error('Error creating voucher:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo voucher'
      });
    }
  },

  async updateVoucher(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        discount_type,
        discount_value,
        min_order_amount,
        max_discount_amount,
        usage_limit,
        start_date,
        end_date,
        status
      } = req.body;

      const voucher = await Voucher.findByPk(id);
      if (!voucher) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy voucher'
        });
      }

      await voucher.update({
        name,
        description,
        discount_type,
        discount_value,
        min_order_amount,
        max_discount_amount,
        usage_limit,
        start_date,
        end_date,
        status
      });

      res.json({
        success: true,
        message: 'Cập nhật voucher thành công',
        voucher
      });
    } catch (error) {
      console.error('Error updating voucher:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật voucher'
      });
    }
  },

  async deleteVoucher(req, res) {
    try {
      const { id } = req.params;

      const voucher = await Voucher.findByPk(id);
      if (!voucher) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy voucher'
        });
      }

      await voucher.destroy();

      res.json({
        success: true,
        message: 'Xóa voucher thành công'
      });
    } catch (error) {
      console.error('Error deleting voucher:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa voucher'
      });
    }
  }
};

module.exports = voucherController;