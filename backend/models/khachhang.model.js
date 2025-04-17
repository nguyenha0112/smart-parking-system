import mongoose from "mongoose";

const KhachHangSchema = new mongoose.Schema({
  TenKhachHang: { type: String, required: true },
  GioiTinh: { type: String, enum: ["Nam", "Nu"], required: true },
  SDT: { type: String, required: true },
}, { timestamps: true });

export const KhachHang = mongoose.model("KhachHang", KhachHangSchema);