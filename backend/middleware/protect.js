import jwt from "jsonwebtoken";
import { TaiKhoan } from "../models/taikhoan.model.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies["jwt-token"];
    if (!token) {
      return res.status(401).json({ message: "Không có token." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await TaiKhoan.findById(decoded.id).populate("KhachHang");

    if (!user) {
      return res.status(401).json({ message: "Không tìm thấy người dùng." });
    }

    req.user = user; // đẩy user vào req
    next();
  } catch (error) {
    console.error("Lỗi xác thực token:", error);
    return res.status(401).json({ message: "Token không hợp lệ." });
  }
};
