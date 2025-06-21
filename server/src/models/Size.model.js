module.exports = (sequelize, DataTypes) => {
  const Size = sequelize.define('Size', {
    name: { 
      type: DataTypes.STRING(20), allowNull: false 
    },
    description: { 
      type: DataTypes.STRING(100) 
    }
  }, {
    tableName: 'size',
    underscored: false,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Size.associate = models => {
    Size.hasMany(models.ProductSize, { 
      foreignKey: 'size_id' 
    });                                                                                                                                                                                                                                                                                                                                                                                                                                                             
  };

  return Size;
};