module.exports = (sequelize, DataTypes) => {
  const RoleUser = sequelize.define('RoleUser', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'role',
        key: 'id'
      }
    },
  }, {
    tableName: 'roleuser',
    timestamps: true,
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  });

  return RoleUser;
};