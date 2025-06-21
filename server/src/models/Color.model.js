module.exports = (sequelize, DataTypes) => {
  const Color = sequelize.define('Color', {
    name: { 
      type: DataTypes.STRING(50), 
      allowNull: false 
    },
    hex_code: { 
      type: DataTypes.STRING(7) 
    }
  }, {
    tableName: 'color',
    underscored: false,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Color.associate = models => {
    Color.hasMany(models.ProductColor, { 
      foreignKey: 'color_id' 
    });
  };

  return Color;
};