const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;
const Role = db.Role;

exports.register = async (req, res) => {
  try {
    const { username, email, password, first_name, last_name } = req.body;
    console.log('Registration request received:', req.body);

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { username: username },
          { email: email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.username === username 
          ? 'Tên đăng nhập đã tồn tại' 
          : 'Email đã được sử dụng'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      first_name: first_name || null,
      last_name: last_name || null,
      status: 'active'
    });

    // Find customer role
    const customerRole = await Role.findOne({ where: { name: 'customer' } });
    
    if (!customerRole) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi hệ thống: Vai trò mặc định không tồn tại'
      });
    }
    
    // Gán vai trò 'customer' cho người dùng mới
    await newUser.addRole(customerRole);

    // Trả về thông báo thành công (không bao gồm mật khẩu)
    const userData = { 
      id: newUser.id, 
      username: newUser.username, 
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name
    };
    
    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      user: userData
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi đăng ký',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if ((!username) || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tên đăng nhập và mật khẩu'
      });
    }

    // Find user
    const user = await User.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { username: username },
          { email: username }
        ]
      },
      include: [{
        model: Role,
        attributes: ['id', 'name'],
        through: { attributes: [] } // Exclude junction table data
      }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Thông tin đăng nhập không chính xác'
      });
    }

    // Check account status
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản đã bị khóa hoặc chưa kích hoạt'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Thông tin đăng nhập không chính xác'
      });
    }

    // Get user roles
    const roles = user.Roles.map(role => role.name);

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        roles: roles,
      },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '24h' }
    );

    // Return user data and token
    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: user.avatar,
        roles: roles,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi đăng nhập',
      error: error.message
    });
  }
};