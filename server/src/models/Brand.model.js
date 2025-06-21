module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define('Brand', {
    name: { 
      type: DataTypes.STRING(100), 
      allowNull: false 
    },
    description: { 
      type: DataTypes.TEXT 
    },
    status: { 
      type: DataTypes.ENUM('active', 'inactive'), 
      defaultValue: 'active' 
    }
  }, {
    tableName: 'brand',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Brand.associate = models => {
    Brand.hasMany(models.Product, 
      { foreignKey: 'brand_id' });
  };

  return Brand;
};