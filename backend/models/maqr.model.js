import mongoose from "mongoose";

const QRSchema = new mongoose.Schema({
    ThongTinThanhToan: { type: String, required: true },
    ThongDieuHanh: { type: String, required: true },
    ThongTinXe: { type: String, required: true },
    ThongTinCheckin: { type: Date },
    ThongTinCheckout: { type: Date },
  });
  
  export const QR = mongoose.model("QR", QRSchema);
  