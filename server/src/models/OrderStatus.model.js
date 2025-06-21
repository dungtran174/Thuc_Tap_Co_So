const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OrderStatus = sequelize.define('OrderStatus', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: 'orderstatus',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  OrderStatus.associate = function(models) {
    OrderStatus.hasMany(models.Order, {
      foreignKey: 'order_status_id',
      as: 'Orders'
    });
  };

  return OrderStatus;
};