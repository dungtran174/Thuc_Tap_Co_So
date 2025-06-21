const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Cart',
        key: 'id'
      }
    },
    order_status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'OrderStatus',
        key: 'id'
      }
    },
    payment_method_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'PaymentMethod',
        key: 'id'
      }
    },
    payment_status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'PaymentStatus',
        key: 'id'
      }
    },
    shipment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Shipment',
        key: 'id'
      }
    },
    voucher_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Voucher',
        key: 'id'
      }
    },
    user_address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'UserAddress',
        key: 'id'
      }
    },
    subtotal: {
      type: DataTypes.BIGINT(20),
      allowNull: false
    },
    shipping_fee: {
      type: DataTypes.BIGINT(20),
      allowNull: false
    },
    discount_amount: {
      type: DataTypes.BIGINT(20),
      allowNull: false,
      defaultValue: 0
    },
    total_amount: {
      type: DataTypes.BIGINT(20),
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
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
    },
    // VNPay fields
    vnpay_transaction_ref: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    vnpay_transaction_no: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    vnpay_response_code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    vnpay_bank_code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    vnpay_pay_date: {
      type: DataTypes.STRING(14),
      allowNull: true
    }
  }, {
    tableName: 'order',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Order.associate = function(models) {
    Order.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'User'
    });

    Order.belongsTo(models.Cart, {
      foreignKey: 'cart_id',
      as: 'Cart'
    });

    Order.belongsTo(models.UserAddress, {
      foreignKey: 'user_address_id',
      as: 'UserAddress'
    });

    Order.belongsTo(models.OrderStatus, {
      foreignKey: 'order_status_id',
      as: 'OrderStatus'
    });

    Order.belongsTo(models.PaymentMethod, {
      foreignKey: 'payment_method_id',
      as: 'PaymentMethod'
    });

    Order.belongsTo(models.PaymentStatus, {
      foreignKey: 'payment_status_id',
      as: 'PaymentStatus'
    });

    Order.belongsTo(models.Shipment, {
      foreignKey: 'shipment_id',
      as: 'Shipment'
    });

    Order.belongsTo(models.Voucher, {
      foreignKey: 'voucher_id',
      as: 'Voucher'
    });

    Order.hasMany(models.OrderDetail, {
      foreignKey: 'order_id',
      as: 'OrderDetails'
    });
  };

  return Order;
};