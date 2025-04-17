import mongoose from "mongoose";

const HoaDonChiTietSchema = new mongoose.Schema({
    HoaDon: { type: mongoose.Schema.Types.ObjectId, ref: "HoaDon" },
    DichVu: { type: mongoose.Schema.Types.ObjectId, ref: "DichVu" },
    TenBai: { type: String, required: true },
    ThoiGianVao: { type: Date, required: true },
    ThoiGianRa: { type: Date },
    GiaTien: { type: Number, required: true },
    HinhThucThanhToan: { type: String, required: true },
  });
  
  export const HoaDonChiTiet = mongoose.model("HoaDonChiTiet", HoaDonChiTietSchema);
  