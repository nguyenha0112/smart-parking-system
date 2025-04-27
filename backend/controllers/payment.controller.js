import { HoaDonChiTiet } from '../models/hoadonchitiet.model.js';
import { TaiKhoan } from '../models/taikhoan.model.js';
import { Notification } from '../models/notification.model.js';

// Thanh toán hóa đơn
export const processPayment = async (req, res) => {
  try {
    const { hoaDonChiTietId } = req.body;
    const userId = req.user._id; // Lấy từ req.user._id (từ middleware protectRoute)

    // Tìm chi tiết hóa đơn
    const hoaDonChiTiet = await HoaDonChiTiet.findById(hoaDonChiTietId);
    if (!hoaDonChiTiet) {
      return res.status(404).json({ success: false, message: 'Hóa đơn không tồn tại' });
    }

    // Kiểm tra xem hóa đơn đã thanh toán chưa
    if (hoaDonChiTiet.HinhThucThanhToan !== 'Chưa thanh toán') {
      return res.status(400).json({ success: false, message: 'Hóa đơn đã được thanh toán' });
    }

    // Tìm tài khoản người dùng
    const taiKhoan = await TaiKhoan.findById(userId).populate('KhachHang');
    if (!taiKhoan) {
      return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại' });
    }

    // Giả lập kiểm tra số dư ví điện tử (giả sử ViDienTuThanhToan là số dư)
    const soDu = parseFloat(taiKhoan.ViDienTuThanhToan);
    if (isNaN(soDu) || soDu < hoaDonChiTiet.GiaTien) {
      return res.status(400).json({ success: false, message: 'Số dư ví điện tử không đủ để thanh toán' });
    }

    // Trừ tiền từ ví
    taiKhoan.ViDienTuThanhToan = (soDu - hoaDonChiTiet.GiaTien).toString();
    await taiKhoan.save();

    // Cập nhật trạng thái thanh toán
    hoaDonChiTiet.HinhThucThanhToan = 'Ví điện tử';
    await hoaDonChiTiet.save();

    // Gửi thông báo
    const notification = new Notification({
      userId,
      title: 'Thanh toán thành công',
      content: `Hóa đơn ${hoaDonChiTietId} cho dịch vụ đã được thanh toán thành công qua ví điện tử.`,
    });
    await notification.save();

    res.json({
      success: true,
      message: 'Thanh toán hóa đơn thành công',
      data: { hoaDonChiTiet, soDuConLai: taiKhoan.ViDienTuThanhToan },
    });
  } catch (error) {
    console.error('Lỗi trong processPayment:', error.message);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi xử lý thanh toán',
      error: error.message,
    });
  }
};