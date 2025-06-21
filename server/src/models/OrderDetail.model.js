const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrderDetail = sequelize.define('OrderDetail', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Order',
        key: 'id'
      }
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Product',
        key: 'id'
      }
    },
    color_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Color',
        key: 'id'
      }
    },
    size_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Size',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    unit_price: {
      type: DataTypes.BIGINT(20),
      allowNull: false
    },
    total_price: {
      type: DataTypes.BIGINT(20),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'orderdetail',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  OrderDetail.associate = function(models) {
    OrderDetail.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'Order'
    });

    OrderDetail.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'Product'
    });

    OrderDetail.belongsTo(models.Color, {
      foreignKey: 'color_id',
      as: 'Color'
    });

    OrderDetail.belongsTo(models.Size, {
      foreignKey: 'size_id',
      as: 'Size'
    });
  };

  return OrderDetail;
};