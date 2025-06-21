module.exports = (sequelize, DataTypes) => {
  const UserAddress = sequelize.define('UserAddress', {
    id: { 
      type: DataTypes.INTEGER,
      primaryKey: true, 
      autoIncrement: true 
    },
    user_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    recipient_name: { 
      type: DataTypes.STRING(100), 
      allowNull: false 
    },
    recipient_phone: { 
      type: DataTypes.STRING(20), 
      allowNull: false 
    },
    address: { 
      type: DataTypes.STRING(255), 
      allowNull: false 
    },
    is_default: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: false 
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
    tableName: 'useraddress',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  UserAddress.associate = models => {
    UserAddress.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return UserAddress;
};