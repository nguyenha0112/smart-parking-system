import { HoaDon } from "../models/hoadon.model.js";
import { ThanhToan } from "../models/thanhtoan.model.js";

export const thanhToanHoaDon = async (req, res) => {
    try {
        const { hoaDonId, hinhThucThanhToan, soTien } = req.body;

        // Kiểm tra hóa đơn có tồn tại không
        const hoaDon = await HoaDon.findById(hoaDonId);
        if (!hoaDon) {
            return res.status(404).json({ message: "Hóa đơn không tồn tại" });
        }

        // Kiểm tra số tiền hợp lệ
        if (soTien <= 0) {
            return res.status(400).json({ message: "Số tiền thanh toán không hợp lệ" });
        }

        // Xử lý thanh toán
        const thanhToan = new ThanhToan({
            HoaDon: hoaDonId,
            SoTien: soTien,
            HinhThucThanhToan: hinhThucThanhToan,
            TrangThai: "Thành công"
        });
        await thanhToan.save();

        res.status(200).json({ message: "Thanh toán thành công", thanhToan });
    } catch (error) {
        res.status(500).json({ message: "Lỗi xử lý thanh toán", error });
    }
};