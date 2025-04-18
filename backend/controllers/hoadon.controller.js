import { HoaDon } from "../models/hoadon.model.js";
import { HoaDonChiTiet } from "../models/hoadonchitiet.model.js";

//Tạo hóa đơn mới
export const createInvoice = async (req, res) => {
    try {
        const { taiKhoanId, ngayLap, chiTiet } = req.body;

        if (!taiKhoanId || !ngayLap || !chiTiet || chiTiet.length === 0) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Tạo hóa đơn
        const hoaDon = new HoaDon({
            TaiKhoan: taiKhoanId,
            NgayLap: new Date(ngayLap)
        });
        await hoaDon.save();

        // Tạo các chi tiết hóa đơn
        const chiTietPromises = chiTiet.map((item) => {
            return new HoaDonChiTiet({
                HoaDon: hoaDon._id,
                DichVu: item.dichVuId,
                TenBai: item.tenBai,
                ThoiGianVao: item.thoiGianVao,
                ThoiGianRa: item.thoiGianRa,
                GiaTien: item.giaTien,
                HinhThucThanhToan: item.hinhThucThanhToan
            }).save();
        });

        const chiTietSaved = await Promise.all(chiTietPromises);

        res.status(201).json({ message: "Hóa đơn đã được tạo", hoaDon, chiTiet: chiTietSaved });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};


//Lấy danh sách hóa đơn theo tài khoản
export const getInvoicesByUser = async (req, res) => {
    try {
        const { taiKhoanId } = req.params;

        const hoaDons = await HoaDon.find({ TaiKhoan: taiKhoanId }).populate("TaiKhoan");

        res.status(200).json(hoaDons);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

//Lấy chi tiết hóa đơn theo ID hóa đơn và tính tổng tiền
export const getInvoiceDetails = async (req, res) => {
    try {
        const { hoaDonId } = req.params;

        const chiTiet = await HoaDonChiTiet.find({ HoaDon: hoaDonId }).populate("DichVu");

        const tongTien = chiTiet.reduce((sum, ct) => sum + ct.GiaTien, 0);

        res.status(200).json({ chiTiet, tongTien });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
