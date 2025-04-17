import mongoose from "mongoose";

const QuanLyBaiDoSchema = new mongoose.Schema({
    TenBai: { type: String, required: true },
    DiaChi: { type: String, required: true },
  });
  
  export const QuanLyBaiDo = mongoose.model("QuanLyBaiDo", QuanLyBaiDoSchema);