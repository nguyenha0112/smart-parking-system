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

//update
export async function updateAccount(req, res) {
  try {
    const {
      TenDangNhap,
      MatKhau,
      ViDienTuThanhToan,
      TenKhachHang,
      GioiTinh,
      SDT,
    } = req.body;

    const taiKhoan = await TaiKhoan.findById(req.user._id);
    if (!taiKhoan) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản." });
    }

    // Hash mật khẩu nếu có cập nhật
    if (MatKhau) {
      taiKhoan.MatKhau = await bcryptjs.hash(MatKhau, 10);
    }

    if (TenDangNhap) taiKhoan.TenDangNhap = TenDangNhap;
    if (ViDienTuThanhToan) taiKhoan.ViDienTuThanhToan = ViDienTuThanhToan;

    const khachHang = await KhachHang.findById(taiKhoan.KhachHang);
    if (TenKhachHang) khachHang.TenKhachHang = TenKhachHang;
    if (GioiTinh) khachHang.GioiTinh = GioiTinh;
    if (SDT) khachHang.SDT = SDT;

    await taiKhoan.save();
    await khachHang.save();

    res.status(200).json({ message: "Cập nhật thành công." });
  } catch (error) {
    console.error("Lỗi khi cập nhật tài khoản:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi cập nhật." });
  }
}

//delete
export async function deleteAccount(req, res) {
  try {
    const taiKhoan = await TaiKhoan.findById(req.user._id);
    if (!taiKhoan) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản." });
    }

    await KhachHang.findByIdAndDelete(taiKhoan.KhachHang);
    await TaiKhoan.findByIdAndDelete(req.user._id);

    res.clearCookie("jwt-token"); // Đăng xuất luôn
    res.status(200).json({ message: "Tài khoản đã được xóa." });
  } catch (error) {
    console.error("Lỗi khi xóa tài khoản:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi xóa tài khoản." });
  }
}

//get all
export const getAllAccounts = async (req, res) => {
  try {
    const accounts = await TaiKhoan.find().populate("KhachHang");
    res.status(200).json({ success: true, data: accounts });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tài khoản:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};




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