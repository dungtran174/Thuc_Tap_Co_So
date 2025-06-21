module.exports = (sequelize, DataTypes) => {
  const ProductColor = sequelize.define('ProductColor', {
    product_id: { 
      type: DataTypes.INTEGER, allowNull: false 
    },
    color_id: { 
      type: DataTypes.INTEGER, allowNull: false 
    },
    image: { 
      type: DataTypes.STRING(255) 
    }
  }, {
    tableName: 'productcolor',
    underscored: false,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [{ unique: true, fields: ['product_id', 'color_id'] }]
  });

  ProductColor.associate = models => {
    ProductColor.belongsTo(models.Product, 
      { foreignKey: 'product_id' });
    ProductColor.belongsTo(models.Color,
       { foreignKey: 'color_id' });
  };

  return ProductColor;
};