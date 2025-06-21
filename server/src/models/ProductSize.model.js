module.exports = (sequelize, DataTypes) => {
  const ProductSize = sequelize.define('ProductSize', {
    product_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    size_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    original_price: { 
      type: DataTypes.BIGINT(20), 
      allowNull: false 
    },
    sale_price: { 
      type: DataTypes.BIGINT(20) 
    },
    quantity: { 
      type: DataTypes.INTEGER, 
      defaultValue: 0 
    }
  }, {
    tableName: 'productsize',
    underscored: false,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [{ unique: true, fields: ['product_id', 'size_id'] }]
  });

  ProductSize.associate = models => {
    ProductSize.belongsTo(models.Product,
      { foreignKey: 'product_id' });
    ProductSize.belongsTo(models.Size,
      { foreignKey: 'size_id' });
  };

  return ProductSize;
};