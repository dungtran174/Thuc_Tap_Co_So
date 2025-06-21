const { Shipment } = require('../models');
const { Op } = require('sequelize');

const shipmentController = {
  async getAllShipments(req, res) {
    try {
      const shipments = await Shipment.findAll({
        where: { status: 'active' },
        order: [['price', 'ASC']]
      });

      res.json({
        success: true,
        shipments
      });

    } catch (error) {
      console.error('Error getting shipments:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy danh sách phương thức vận chuyển',
        error: error.message
      });
    }
  },

  // Admin methods
  async getAllShipmentsByAdmin(req, res) {
    try {
      const { page = 1, limit = 10, search = '', status = '' } = req.query;
      const offset = (page - 1) * parseInt(limit);

      const where = {};
      if (search) {
        where.name = { [Op.like]: `%${search}%` };
      }
      if (status) {
        where.status = status;
      }

      const { count, rows } = await Shipment.findAndCountAll({
        where,
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset
      });

      res.json({
        success: true,
        shipments: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error getting shipments by admin:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách vận chuyển'
      });
    }
  },

  async createShipment(req, res) {
    try {
      const { name, description, price, estimated_days } = req.body;

      const shipment = await Shipment.create({
        name,
        description,
        price,
        estimated_days,
        status: 'active'
      });

      res.status(201).json({
        success: true,
        message: 'Tạo phương thức vận chuyển thành công',
        shipment
      });
    } catch (error) {
      console.error('Error creating shipment:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo phương thức vận chuyển'
      });
    }
  },

  async updateShipment(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price, estimated_days, status } = req.body;

      const shipment = await Shipment.findByPk(id);
      if (!shipment) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy phương thức vận chuyển'
        });
      }

      await shipment.update({
        name,
        description,
        price,
        estimated_days,
        status
      });

      res.json({
        success: true,
        message: 'Cập nhật phương thức vận chuyển thành công',
        shipment
      });
    } catch (error) {
      console.error('Error updating shipment:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật phương thức vận chuyển'
      });
    }
  },

  async deleteShipment(req, res) {
    try {
      const { id } = req.params;

      const shipment = await Shipment.findByPk(id);
      if (!shipment) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy phương thức vận chuyển'
        });
      }

      await shipment.destroy();

      res.json({
        success: true,
        message: 'Xóa phương thức vận chuyển thành công'
      });
    } catch (error) {
      console.error('Error deleting shipment:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa phương thức vận chuyển'
      });
    }
  }
};

module.exports = shipmentController;