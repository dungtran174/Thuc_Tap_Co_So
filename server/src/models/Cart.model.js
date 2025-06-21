const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Cart = sequelize.define('Cart', {
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
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    total_amount: {
      type: DataTypes.BIGINT(20),
      allowNull: false,
      defaultValue: 0
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
    tableName: 'cart',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // Định nghĩa quan hệ
  Cart.associate = function(models) {
    // Cart belongs to User
    Cart.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'User'
    });

    // Cart has many CartDetails
    Cart.hasMany(models.CartDetail, {
      foreignKey: 'cart_id',
      as: 'CartDetails'
    });
  };

  return Cart;
};