const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PaymentStatus = sequelize.define('PaymentStatus', {
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
    tableName: 'paymentstatus',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  PaymentStatus.associate = function(models) {
    PaymentStatus.hasMany(models.Order, {
      foreignKey: 'payment_status_id',
      as: 'Orders'
    });
  };

  return PaymentStatus;
};