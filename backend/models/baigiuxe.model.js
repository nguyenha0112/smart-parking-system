import mongoose from "mongoose";

const BaiDoXeSchema = new mongoose.Schema({
    TenBai: { type: String, required: true },
    DiaChi: { type: String, required: true },
    SoChoTrong: { type: Number, required: true },
  });
  
  export const BaiDoXe = mongoose.model("BaiDoXe", BaiDoXeSchema);
  