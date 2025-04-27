import { HoaDon } from '../models/hoadon.model.js';
import { HoaDonChiTiet } from '../models/hoadonchitiet.model.js';
import { DichVu } from '../models/dichvu.model.js';
import { BaiDoXe } from '../models/baigiuxe.model.js'; // Sửa từ baidoxe.model.js thành baigiuxe.model.js
import { Notification } from '../models/notification.model.js';

// Tạo hóa đơn thủ công
export const createInvoice = async (req, res) => {
  try {
    const { taiKhoanId, dichVuId, baiDoXeId, thoiGianVao, thoiGianRa } = req.body;
    const userId = req.user._id; // Lấy từ req.user._id

    // Kiểm tra dịch vụ
    const dichVu = await DichVu.findById(dichVuId);
    if (!dichVu) {
      return res.status(404).json({ success: false, message: 'Dịch vụ không tồn tại' });
    }

    // Kiểm tra bãi đỗ xe
    const baiDoXe = await BaiDoXe.findById(baiDoXeId);
    if (!baiDoXe) {
      return res.status(404).json({ success: false, message: 'Bãi đỗ xe không tồn tại' });
    }

    // Tạo hóa đơn
    const hoaDon = new HoaDon({
      TaiKhoan: taiKhoanId,
      NgayLap: new Date(),
    });
    await hoaDon.save();

    // Tạo chi tiết hóa đơn
    const hoaDonChiTiet = new HoaDonChiTiet({
      HoaDon: hoaDon._id,
      DichVu: dichVu._id,
      TenBai: baiDoXe.TenBai,
      ThoiGianVao: new Date(thoiGianVao),
      ThoiGianRa: thoiGianRa ? new Date(thoiGianRa) : null,
      GiaTien: dichVu.GiaDichVu,
      HinhThucThanhToan: 'Chưa thanh toán',
    });
    await hoaDonChiTiet.save();

    // Gửi thông báo cho người dùng
    const notification = new Notification({
      userId: taiKhoanId,
      title: 'Hóa đơn mới',
      content: `Hóa đơn mới đã được tạo cho dịch vụ ${dichVu.TenDichVu}.`,
    });
    await notification.save();

    res.json({ success: true, message: 'Tạo hóa đơn thành công', hoaDon, hoaDonChiTiet });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};