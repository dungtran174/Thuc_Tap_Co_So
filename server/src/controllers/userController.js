const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary.config');  // ✅ IMPORT CLOUDINARY
const { sendMail } = require('../utils/email.utils');       // ✅ IMPORT SENDMAIL

const User = db.User;
const RoleUser = db.RoleUser;
const Role = db.Role;

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { 
        exclude: ['password'] 
      },
      include: [{ 
        model: db.UserAddress, 
        as: 'addresses' 
      }]
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      }); 
    }
    
    res.json({ 
      success: true, 
      user 
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching profile', 
      error: err.message 
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, first_name, last_name, email, phone } = req.body;
    
    // Check if email or username is already taken by another user
    const existingUser = await User.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ email }, { username }],
        id: { [db.Sequelize.Op.ne]: req.user.id }
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email đã được sử dụng' : 'Tên đăng nhập đã được sử dụng'
      });
    }

    // Update user
    await User.update({
      username,
      first_name,
      last_name,
      email,
      phone
    }, {
      where: { id: req.user.id }
    });

    // Get updated user
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({ 
      success: true, 
      user: updatedUser,
      message: 'Profile updated successfully' 
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating profile', 
      error: err.message 
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Verify old password
    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Old password is incorrect' 
      });
    }
    
    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await User.update({
      password: hashedNewPassword
    }, {
      where: { id: req.user.id }
    });
    
    res.json({ 
      success: true, 
      message: 'Password changed successfully' 
    });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error changing password', 
      error: err.message 
    });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    const filePath = path.resolve(req.file.path);
    
    // ✅ UPLOAD LÊN CLOUDINARY
    const result = await cloudinary.uploader.upload(filePath, { 
      folder: 'avatars',
      public_id: `avatar_${req.user.id}_${Date.now()}`,
      overwrite: true,
      transformation: [
        { width: 200, height: 200, crop: 'fill' },
        { quality: 'auto' }
      ]
    });

    // Update user avatar in database
    await User.update({
      avatar: result.secure_url
    }, {
      where: { id: req.user.id }
    });

    // ✅ XÓA FILE TẠM THỜI
    fs.unlink(filePath, (err) => {
      if (err) console.error('Failed to delete temp file:', err);
    });

    res.json({ 
      success: true, 
      message: 'Avatar uploaded successfully',
      avatar: result.secure_url 
    });
  } catch (err) {
    console.error('Upload avatar error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Upload failed', 
      error: err.message
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Email not found' 
      });
    }
    
    // Generate reset token
    const resetToken = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET || 'default_jwt_secret', 
      { expiresIn: '15m' }
    );
    
    // Create reset link
    const resetLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    
    // ✅ EMAIL TEMPLATE
    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Khôi phục mật khẩu</h2>
        <p>Xin chào ${user.first_name || user.username},</p>
        <p>Chúng tôi nhận được yêu cầu khôi phục mật khẩu cho tài khoản của bạn.</p>
        <p>Vui lòng nhấp vào nút bên dưới để tạo mật khẩu mới:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Khôi phục mật khẩu
          </a>
        </div>
        <p><small>Link này sẽ hết hạn trong 15 phút.</small></p>
        <p>Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng bỏ qua email này.</p>
        <hr>
        <p><small>ApparelStore Team</small></p>
      </div>
    `;
    
    // ✅ GỬI EMAIL
    await sendMail(email, 'Khôi phục mật khẩu - ApparelStore', emailTemplate);
    
    res.json({ 
      success: true, 
      message: 'Reset link sent to email successfully' 
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending reset email', 
      error: err.message 
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // ✅ VERIFY TOKEN
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret');
    } catch (jwtError) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired reset token' 
      });
    }
    
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await User.update({
      password: hashedPassword
    }, {
      where: { id: user.id }
    });
    
    res.json({ 
      success: true, 
      message: 'Password reset successful' 
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error resetting password', 
      error: err.message 
    });
  }
};

// ==================== ADMIN METHODS ====================

exports.createUserByAdmin = async (req, res) => {
  try {
    const { 
      username, 
      email, 
      password, 
      first_name, 
      last_name, 
      phone, 
      avatar, 
      status = 'active',
      roles = [] 
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email đã được sử dụng' : 'Tên đăng nhập đã được sử dụng'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      first_name,
      last_name,
      phone,
      avatar,
      status
    });

    // Assign roles if provided
    if (roles && Array.isArray(roles) && roles.length > 0) {
      const roleUserData = roles.map(roleId => ({
        user_id: newUser.id,
        role_id: roleId
      }));
      await RoleUser.bulkCreate(roleUserData);
    } else {
      // Assign default user role if no roles provided
      const userRole = await Role.findOne({ where: { name: 'user' } });
      if (userRole) {
        await RoleUser.create({
          user_id: newUser.id,
          role_id: userRole.id
        });
      }
    }

    // Get created user with roles
    const createdUser = await User.findByPk(newUser.id, {
      include: [{
        model: Role,
        through: { attributes: [] },
        attributes: ['id', 'name']
      }],
      attributes: { exclude: ['password'] }
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: createdUser
    });
  } catch (err) {
    console.error('Create user by admin error:', err);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: err.message
    });
  }
};

exports.getAllUsersByAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where[db.Sequelize.Op.or] = [
        { first_name: { [db.Sequelize.Op.like]: `%${search}%` } },
        { last_name: { [db.Sequelize.Op.like]: `%${search}%` } },
        { email: { [db.Sequelize.Op.like]: `%${search}%` } },
        { username: { [db.Sequelize.Op.like]: `%${search}%` } }
      ];
    }
    if (status) {
      where.status = status;
    }    const { count, rows } = await User.findAndCountAll({
      where,
      include: [{
        model: Role,
        through: { attributes: [] },
        attributes: ['id', 'name']
      }],
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
      distinct: true
    });

    res.json({
      success: true,
      users: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Get all users by admin error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: err.message
    });
  }
};

exports.updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone, avatar, status, roles } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({
      where: {
        email,
        id: { [db.Sequelize.Op.ne]: id }
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Update user info
    await User.update({
      first_name,
      last_name,
      email,
      phone,
      avatar,
      status
    }, {
      where: { id }
    });

    // Update roles if provided
    if (roles && Array.isArray(roles)) {
      await RoleUser.destroy({ where: { user_id: id } });
      
      const roleUserData = roles.map(roleId => ({
        user_id: id,
        role_id: roleId
      }));
      
      if (roleUserData.length > 0) {
        await RoleUser.bulkCreate(roleUserData);
      }
    }    const updatedUser = await User.findByPk(id, {
      include: [{
        model: Role,
        through: { attributes: [] },
        attributes: ['id', 'name']
      }],
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error('Update user by admin error:', err);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: err.message
    });
  }
};

exports.deleteUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await User.destroy({ where: { id } });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (err) {
    console.error('Delete user by admin error:', err);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: err.message
    });
  }
};

exports.getUserDetailsByAdmin = async (req, res) => {
  try {
    const { id } = req.params;    const user = await User.findByPk(id, {
      include: [
        {
          model: Role,
          through: { attributes: [] },
          attributes: ['id', 'name']
        },
        {
          model: db.UserAddress,
          as: 'addresses'
        }
      ],
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (err) {
    console.error('Get user details by admin error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching user details',
      error: err.message
    });
  }
};

exports.getUserStatsForAdmin = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const [
      totalUsers,
      activeUsers,
      newUsers,
      usersByStatus
    ] = await Promise.all([
      // Total users
      User.count(),

      // Active users
      User.count({ where: { status: 'active' } }),

      // New users in period
      User.count({
        where: {
          created_at: { [db.Sequelize.Op.between]: [startDate, endDate] }
        }
      }),

      // Users by status
      User.findAll({
        attributes: [
          'status',
          [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'count']
        ],
        group: ['status'],
        raw: true
      })
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        newUsers,
        usersByStatus
      }
    });
  } catch (err) {
    console.error('Get user stats error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: err.message
    });
  }
};