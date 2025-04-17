import mongoose from "mongoose";

const XeSchema = new mongoose.Schema({
  TaiKhoan: { type: mongoose.Schema.Types.ObjectId, ref: "TaiKhoan" },
  LoaiXe: { type: String, required: true },
  BienSo: { type: String, required: true },
  TinhTrang: { type: String, enum: ["Đang gửi", "Đã lấy", "Hỏng"], required: true },
  QR: { type: mongoose.Schema.Types.ObjectId, ref: "QR" },
}, { timestamps: true });

export const Xe = mongoose.model("Xe", XeSchema);