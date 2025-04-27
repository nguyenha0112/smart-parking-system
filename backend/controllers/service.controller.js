import { v4 as uuidv4 } from 'uuid';
import { DichVu } from '../models/dichvu.model.js';
import { BaiDoXe } from '../models/baigiuxe.model.js'; // Sửa từ baidoxe.model.js thành baigiuxe.model.js
import { HoaDon } from '../models/hoadon.model.js';
import { HoaDonChiTiet } from '../models/hoadonchitiet.model.js';
import Ticket from '../models/ticket.model.js';
import { Notification } from '../models/notification.model.js';

// Đặt dịch vụ
export const bookService = async (req, res) => {
  try {
    const { dichVuId, baiDoXeId, thoiGianVao } = req.body;
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
    if (baiDoXe.SoChoTrong <= 0) {
      return res.status(400).json({ success: false, message: 'Bãi đỗ xe đã hết chỗ' });
    }

    // Tạo hóa đơn
    const hoaDon = new HoaDon({
      TaiKhoan: userId,
      NgayLap: new Date(),
    });
    await hoaDon.save();

    // Tạo chi tiết hóa đơn
    const hoaDonChiTiet = new HoaDonChiTiet({
      HoaDon: hoaDon._id,
      DichVu: dichVu._id,
      TenBai: baiDoXe.TenBai,
      ThoiGianVao: new Date(thoiGianVao),
      GiaTien: dichVu.GiaDichVu,
      HinhThucThanhToan: 'Chưa thanh toán',
    });
    await hoaDonChiTiet.save();

    // Tạo vé cho giữ xe
    const ticket = new Ticket({
      ticketId: uuidv4(),
      seatNumber: `SPOT-${Math.floor(Math.random() * 1000)}`,
      licensePlate: 'UNKNOWN', // Có thể yêu cầu người dùng nhập
      checkinTime: new Date(thoiGianVao),
      createBy: userId,
    });
    await ticket.save();

    // Cập nhật số chỗ trống
    baiDoXe.SoChoTrong -= 1;
    await baiDoXe.save();

    // Gửi thông báo
    const notification = new Notification({
      userId,
      title: 'Đặt dịch vụ thành công',
      content: `Bạn đã đặt dịch vụ ${dichVu.TenDichVu} tại ${baiDoXe.TenBai}.`,
    });
    await notification.save();

    res.json({ success: true, message: 'Đặt dịch vụ thành công', hoaDonChiTiet, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};