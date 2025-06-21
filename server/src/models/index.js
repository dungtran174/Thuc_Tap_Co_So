const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const basename = path.basename(__filename);
const dbConfig = require('../config/db.config');
const db = {};
// Khởi tạo Sequelize với thông tin cấu hình rõ ràng
const sequelize = new Sequelize(
  dbConfig.DB_NAME,
  dbConfig.DB_USER,
  dbConfig.DB_PASSWORD,
  {
    host: dbConfig.DB_HOST,
    dialect: 'mysql',
    logging: false // Tắt logging trong production
  }
);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Associations
Object.values(db).forEach(model => {
  if (model.associate) model.associate(db);
});

// Load models
fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js') && file.includes('.model.');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// QUAN TRỌNG: Xóa phần sync() ở đây
// db.sequelize.sync({ alter: true }).then()...

// Function để khởi tạo dữ liệu ban đầu (giữ lại)
db.initialize = async () => {
  try {
    // Tạo vai trò mặc định nếu chưa có
    const customerRole = await db.Role.findOrCreate({
      where: { name: 'customer' },
      defaults: { description: 'Regular customer' }
    });
    
    const adminRole = await db.Role.findOrCreate({
      where: { name: 'admin' },
      defaults: { description: 'System administrator' }
    });

    console.log('Roles initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database data:', error);
  }
};

module.exports = db;