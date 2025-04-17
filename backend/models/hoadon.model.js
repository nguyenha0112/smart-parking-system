import mongoose from "mongoose";

const HoaDonSchema = new mongoose.Schema({
    TaiKhoan: { type: mongoose.Schema.Types.ObjectId, ref: "TaiKhoan" },
    NgayLap: { type: Date, required: true },
  });
  
  export const HoaDon = mongoose.model("HoaDon", HoaDonSchema);
  