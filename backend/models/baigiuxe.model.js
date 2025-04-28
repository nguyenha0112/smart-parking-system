import mongoose from "mongoose";

const BaiDoXeSchema = new mongoose.Schema({
  TenBai: { type: String, required: true },
  DiaChi: { type: String, required: true },
  SoChoTrong: { type: Number, required: true },
  GiaTien: { type: Number, required: true }, // G
});

export const BaiDoXe = mongoose.model("BaiDoXe", BaiDoXeSchema);
