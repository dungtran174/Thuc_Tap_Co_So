module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
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
    tableName: 'category',
    underscored: false,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Category.associate = models => {
    Category.hasMany(models.Product, { 
      foreignKey: 'category_id' 
    });
  };

  return Category;
};