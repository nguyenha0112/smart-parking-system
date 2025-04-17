import mongoose from "mongoose";

const DichVuSchema = new mongoose.Schema({
  TenDichVu: { type: String, required: true },
  GiaDichVu: { type: Number, required: true },
  ThoiHan: { type: String },
}, { timestamps: true });

export const DichVu = mongoose.model("DichVu", DichVuSchema);