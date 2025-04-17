import { TaiKhoan } from "../models/taikhoan.model.js";
import { KhachHang } from "../models/khachhang.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenandsetcookie } from "../utils/generateToken.js";

// Hàm đăng ký người dùng mới
export async function signup(req, res) {
  try {
    const {
      TenDangNhap,
      MatKhau,
      ViDienTuThanhToan,
      TenKhachHang,
      GioiTinh,
      SDT,
    } = req.body;

    // Kiểm tra nếu tài khoản đã tồn tại
    const existingUser = await TaiKhoan.findOne({ TenDangNhap });
    if (existingUser) {
      return res.status(400).json({ message: "Tên đăng nhập đã tồn tại." });
    }

    // Hash mật khẩu
    const hashedPassword = await bcryptjs.hash(MatKhau, 10);

    // Tạo khách hàng mới
    const khachHang = await KhachHang.create({
      TenKhachHang,
      GioiTinh,
      SDT,
    });

    // Tạo tài khoản mới
    const taiKhoan = await TaiKhoan.create({
      KhachHang: khachHang._id,
      ViDienTuThanhToan,
      TenDangNhap,
      MatKhau: hashedPassword,
    });

    // Tạo token và set cookie
    const token = generateTokenandsetcookie(taiKhoan._id, res);

    res.status(201).json({ message: "Đăng ký thành công.", token });
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi đăng ký." });
  }
}

// Hàm đăng nhập người dùng
export async function login(req, res) {
  try {
    const { TenDangNhap, MatKhau } = req.body;

    // Kiểm tra tài khoản
    const user = await TaiKhoan.findOne({ TenDangNhap }).populate("KhachHang");
    if (!user) {
      return res
        .status(400)
        .json({ message: "Tên đăng nhập hoặc mật khẩu không đúng." });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcryptjs.compare(MatKhau, user.MatKhau);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Tên đăng nhập hoặc mật khẩu không đúng." });
    }

    // Tạo token và set cookie
    const token = generateTokenandsetcookie(user._id, res);

    res.status(200).json({ message: "Đăng nhập thành công.", token });
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi đăng nhập." });
  }
}

// Hàm đăng xuất người dùng
export async function logout(req, res) {
  try {
    res.clearCookie("jwt-token");
    res.status(200).json({ message: "Đăng xuất thành công." });
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi đăng xuất." });
  }
}