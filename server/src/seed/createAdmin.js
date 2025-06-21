const bcrypt = require('bcryptjs');
const db = require('../models');

const createAdmin = async () => {
  try {
    console.log('🚀 Starting admin creation process...');

    // Sync database first
    await db.sequelize.sync();

    // Kiểm tra role admin đã có chưa
    let adminRole = await db.Role.findOne({ where: { name: 'admin' } });
    if (!adminRole) {
      adminRole = await db.Role.create({
        name: 'admin',
        description: 'System administrator'
      });
      console.log('✅ Admin role created!');
    } else {
      console.log('ℹ️  Admin role already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Tạo admin user
    const [adminUser, created] = await db.User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        username: 'admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        first_name: 'Admin',
        last_name: 'User',
        status: 'active'
      }
    });

    if (created) {
      console.log('✅ Admin user created!');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Gán quyền admin
    const [roleUser, roleCreated] = await db.RoleUser.findOrCreate({
      where: {
        user_id: adminUser.id,
        role_id: adminRole.id
      },
      defaults: {
        user_id: adminUser.id,
        role_id: adminRole.id
      }
    });

    if (roleCreated) {
      console.log('✅ Admin role assigned!');
    } else {
      console.log('ℹ️  Admin role already assigned');
    }

    console.log('\n🎉 Admin setup completed!');
    console.log('👤 Username: admin');
    console.log('🔑 Password: admin123');
    console.log('📧 Email: admin@apparelstore.com');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await db.sequelize.close();
    process.exit();
  }
};

createAdmin();