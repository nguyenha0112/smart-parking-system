import jwt from "jsonwebtoken";
import { TaiKhoan } from "../models/taikhoan.model.js";

export const protect = async (req, res, next) => {
  try {
    // Lấy token từ cookie
    const token = req.cookies["jwt-token"];
    if (!token) {
      return res.status(401).json({ message: "Không có token, vui lòng đăng nhập lại." });
    }

    // Kiểm tra và giải mã token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }

    // Lấy thông tin người dùng từ token
    const user = await TaiKhoan.findById(decoded.id).populate("KhachHang");

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại hoặc đã bị xóa." });
    }

    // Gắn thông tin người dùng vào đối tượng request
    req.user = user;
    next();
  } catch (error) {
    console.error("Lỗi trong quá trình xác thực:", error);
    return res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình xác thực, vui lòng thử lại sau." });
  }
};
