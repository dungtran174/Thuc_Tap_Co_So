const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Voucher = sequelize.define('Voucher', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    discount_type: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      allowNull: false
    },
    discount_value: {
      type: DataTypes.BIGINT(20),
      allowNull: false
    },
    min_order_amount: {
      type: DataTypes.BIGINT(20),
      allowNull: false,
      defaultValue: 0
    },
    max_discount_amount: {
      type: DataTypes.BIGINT(20),
      allowNull: true
    },
    usage_limit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    used_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'expired'),
      allowNull: false,
      defaultValue: 'active'
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
    tableName: 'voucher',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Voucher.associate = function(models) {
    Voucher.hasMany(models.Order, {
      foreignKey: 'voucher_id',
      as: 'Orders'
    });
  };

  return Voucher;
};