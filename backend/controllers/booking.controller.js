import { KhachHang } from "../models/khachhang.model.js";
import { BaiDoXe } from "../models/baigiuxe.model.js";
import { HoaDonChiTiet } from "../models/hoadonchitiet.model.js";

// Đặt chỗ đậu xe
export const booking = async (req, res) => {
  try {
    const { baiDoXeId, thoiGianVao, thoiGianRa } = req.body;

    // Lấy idKhachHang từ tài khoản đang đăng nhập
    const khachHangId = req.user.KhachHang;

    // Kiểm tra khách hàng
    const khachHang = await KhachHang.findById(khachHangId);
    if (!khachHang) {
      return res.status(404).json({ message: "Không tìm thấy khách hàng." });
    }

    // Kiểm tra bãi đỗ xe
    const baiDoXe = await BaiDoXe.findById(baiDoXeId);
    if (!baiDoXe || baiDoXe.SoChoTrong <= 0) {
      return res.status(400).json({ message: "Bãi đỗ xe không khả dụng." });
    }

    // Tạo hóa đơn chi tiết
    const hoaDonChiTiet = await HoaDonChiTiet.create({
      HoaDon: null, // Có thể liên kết với hóa đơn tổng nếu cần
      DichVu: null, // Có thể thêm dịch vụ nếu cần
      TenBai: baiDoXe.TenBai,
      ThoiGianVao,
      ThoiGianRa,
      GiaTien: 0, // Tính giá tiền sau
      HinhThucThanhToan: "Chưa thanh toán",
    });

    // Giảm số chỗ trống trong bãi đỗ xe
    baiDoXe.SoChoTrong -= 1;
    await baiDoXe.save();

    res.status(201).json({
      message: "Đặt chỗ thành công.",
      data: hoaDonChiTiet,
    });
  } catch (error) {
    console.error("Lỗi khi đặt chỗ:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi đặt chỗ." });
  }
};

// Hủy chỗ đậu xe
export const deletebooking = async (req, res) => {
  try {
    const { hoaDonChiTietId } = req.body;

    // Tìm hóa đơn chi tiết
    const hoaDonChiTiet = await HoaDonChiTiet.findById(hoaDonChiTietId);
    if (!hoaDonChiTiet) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn chi tiết." });
    }

    // Tìm bãi đỗ xe liên quan
    const baiDoXe = await BaiDoXe.findOne({ TenBai: hoaDonChiTiet.TenBai });
    if (baiDoXe) {
      baiDoXe.SoChoTrong += 1; // Tăng số chỗ trống
      await baiDoXe.save();
    }

    // Xóa hóa đơn chi tiết
    await HoaDonChiTiet.findByIdAndDelete(hoaDonChiTietId);

    res.status(200).json({ message: "Hủy chỗ thành công." });
  } catch (error) {
    console.error("Lỗi khi hủy chỗ:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi hủy chỗ." });
  }
};

// Thay đổi chỗ đậu xe
export const updatebooking = async (req, res) => {
  try {
    const { hoaDonChiTietId, baiDoXeMoiId } = req.body;

    // Tìm hóa đơn chi tiết
    const hoaDonChiTiet = await HoaDonChiTiet.findById(hoaDonChiTietId);
    if (!hoaDonChiTiet) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn chi tiết." });
    }

    // Tìm bãi đỗ xe cũ
    const baiDoXeCu = await BaiDoXe.findOne({ TenBai: hoaDonChiTiet.TenBai });
    if (baiDoXeCu) {
      baiDoXeCu.SoChoTrong += 1; // Tăng số chỗ trống
      await baiDoXeCu.save();
    }

    // Tìm bãi đỗ xe mới
    const baiDoXeMoi = await BaiDoXe.findById(baiDoXeMoiId);
    if (!baiDoXeMoi || baiDoXeMoi.SoChoTrong <= 0) {
      return res.status(400).json({ message: "Bãi đỗ xe mới không khả dụng." });
    }

    // Cập nhật thông tin hóa đơn chi tiết
    hoaDonChiTiet.TenBai = baiDoXeMoi.TenBai;
    await hoaDonChiTiet.save();

    // Giảm số chỗ trống trong bãi đỗ xe mới
    baiDoXeMoi.SoChoTrong -= 1;
    await baiDoXeMoi.save();

    res.status(200).json({ message: "Thay đổi chỗ thành công." });
  } catch (error) {
    console.error("Lỗi khi thay đổi chỗ:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi thay đổi chỗ." });
  }
};