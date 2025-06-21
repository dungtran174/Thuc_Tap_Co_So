const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50]
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^[0-9]+$/i
      }
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: 'default-avatar.png'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'banned'),
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
    tableName: 'user',
    timestamps: true,
    createdAt: 'created_at',   // map trường createdAt -> created_at
    updatedAt: 'updated_at'
  });

  User.associate = (models) => {
     User.hasMany(models.UserAddress, { 
      foreignKey: 'user_id', 
      as: 'addresses' 
    });

    User.belongsToMany(models.Role, {
      through: models.RoleUser,
      foreignKey: 'user_id',
      otherKey: 'role_id'
    });

    User.hasMany(models.Review, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
    });

    User.hasMany(models.Cart, {
      foreignKey: 'user_id',
      as: 'carts'
    });


  };

  return User;
};