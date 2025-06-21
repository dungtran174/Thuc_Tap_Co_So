module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: { 
      type: DataTypes.STRING(255), 
      allowNull: false 
    },
    short_description: { 
      type: DataTypes.TEXT,
      allowNull: true
    },
    long_description: { 
      type: DataTypes.TEXT,
      allowNull: true
    },
    category_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      references: {
        model: 'Category',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    brand_id: { 
      type: DataTypes.INTEGER, 
      allowNull: true,
      references: {
        model: 'Brand',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    origin: { 
      type: DataTypes.STRING(100),
      allowNull: true
    },
    material: { 
      type: DataTypes.STRING(100),
      allowNull: true
    },
    original_price: { 
      type: DataTypes.BIGINT(20), 
      allowNull: false 
    },
    sale_price: { 
      type: DataTypes.BIGINT(20),
      allowNull: true
    },
    view_count: { 
      type: DataTypes.INTEGER, 
      defaultValue: 0 
    },
    status: { 
      type: DataTypes.ENUM('active', 'inactive'), 
      defaultValue: 'active'
    },
    created_at: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    },  
    updated_at: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    }
  }, {
    tableName: 'product',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Product.associate = models => {
    Product.belongsTo(models.Category, { foreignKey: 'category_id' });
    Product.belongsTo(models.Brand, { foreignKey: 'brand_id' });
    Product.hasMany(models.ProductColor, { foreignKey: 'product_id', as: 'ProductColors' });
    Product.hasMany(models.ProductSize, { foreignKey: 'product_id' });
    Product.hasMany(models.Review, {
    foreignKey: 'product_id',
    onDelete: 'CASCADE'
    });
    Product.hasMany(models.CartDetail, {
      foreignKey: 'product_id',
    });
  };

  return Product;
};