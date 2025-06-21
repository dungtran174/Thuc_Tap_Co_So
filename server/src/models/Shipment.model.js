const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Shipment = sequelize.define('Shipment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.BIGINT(20),
      allowNull: false
    },
    estimated_days: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
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
    tableName: 'shipment',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Shipment.associate = function(models) {
    Shipment.hasMany(models.Order, {
      foreignKey: 'shipment_id',
      as: 'Orders'
    });
  };

  return Shipment;
};