import jwt from 'jsonwebtoken';
import { TaiKhoan } from '../models/taikhoan.model.js';
import { ENV_VARS } from '../config/envVars.js';

// Middleware bảo vệ route, kiểm tra token
export const protectRoute = async (req, res, next) => {
  try {
    // Lấy token từ cookie
    const token = req.cookies['jwt-token'];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Không có token. Vui lòng đăng nhập để tiếp tục.',
      });
    }

    // Giải mã token
    const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ.',
      });
    }

    // Tìm tài khoản người dùng trong database
    const user = await TaiKhoan.findById(decoded.id).populate('KhachHang');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng.',
      });
    }

    // Gắn thông tin người dùng vào req để sử dụng trong các controller
    req.user = user;

    // Tiếp tục xử lý request
    next();
  } catch (err) {
    console.error('Lỗi trong middleware protectRoute:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ. Vui lòng thử lại sau.',
    });
  }
};

// Middleware kiểm tra vai trò dựa trên cấp bậc
export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const roleHierarchy = {
      customer: 1,
      manager: 2,
      admin: 3,
    };

    const userRole = req.user.Role;
    const userRank = roleHierarchy[userRole];

    // Kiểm tra nếu vai trò của người dùng không nằm trong danh sách được phép
    const isAllowed = allowedRoles.some((role) => userRank >= roleHierarchy[role]);

    if (!isAllowed) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập vào chức năng này.',
      });
    }

    next();
  };
};
