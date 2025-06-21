const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CartDetail = sequelize.define('CartDetail', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Cart',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Product',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    color_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Color',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    size_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Size',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1
      }
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
    tableName: 'CartDetail',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // Định nghĩa quan hệ
  CartDetail.associate = function(models) {
    // CartDetail belongs to Cart
    CartDetail.belongsTo(models.Cart, {
      foreignKey: 'cart_id',
      as: 'Cart'
    });

    // CartDetail belongs to Product
    CartDetail.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'Product'
    });

    // CartDetail belongs to Color
    CartDetail.belongsTo(models.Color, {
      foreignKey: 'color_id',
      as: 'Color'
    });

    // CartDetail belongs to Size
    CartDetail.belongsTo(models.Size, {
      foreignKey: 'size_id',
      as: 'Size'
    });
  };

  return CartDetail;
};