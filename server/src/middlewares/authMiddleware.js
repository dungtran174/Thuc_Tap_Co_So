const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy token xác thực'
      });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret', (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Token không hợp lệ hoặc đã hết hạn',
          error: err.message
        });
      }

      // Attach user info to request object
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message
    });
  }
};

// Middleware để kiểm tra quyền truy cập dựa trên vai trò
exports.authorizeRole = (roles = []) => {
  return (req, res, next) => {
    try {
      // Chuyển đổi roles thành mảng nếu chỉ truyền vào một string
      if (typeof roles === 'string') {
        roles = [roles];
      }

      // Nếu không cần kiểm tra role (mảng rỗng)
      if (roles.length === 0) {
        return next();
      }

      // Đảm bảo req.user đã được thiết lập từ authenticateToken
      if (!req.user || !req.user.roles) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền truy cập'
        });
      }

      // Kiểm tra xem người dùng có vai trò được yêu cầu không
      const hasRole = req.user.roles.some(role => roles.includes(role));
      
      if (!hasRole) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không có quyền để thực hiện hành động này'
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi phân quyền',
        error: error.message
      });
    }
  };
};