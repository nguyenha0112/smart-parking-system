import mongoose from "mongoose";

const TaiKhoanSchema = new mongoose.Schema({
    KhachHang: { type: mongoose.Schema.Types.ObjectId, ref: "KhachHang" },
    ViDienTuThanhToan: { type: String, required: true },
    TenDangNhap: { type: String, required: true, unique: true },
    MatKhau: { type: String, required: true },
  });
  
  export const TaiKhoan = mongoose.model("TaiKhoan", TaiKhoanSchema);