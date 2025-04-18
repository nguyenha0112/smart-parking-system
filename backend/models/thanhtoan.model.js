import mongoose from "mongoose";

const ThanhToanSchema = new mongoose.Schema({
    HoaDon: { type: mongoose.Schema.Types.ObjectId, ref: "HoaDon", required: true },
    HinhThucThanhToan: { 
        type: String, 
        enum: ["Tiền mặt", "Chuyển khoản", "Thẻ tín dụng", "Ví điện tử"], 
        required: true 
    },
    SoTien: { type: Number, required: true, min: 0 },
    TrangThai: { 
        type: String, 
        enum: ["Thành công", "Đang xử lý", "Thất bại"], 
        default: "Đang xử lý" 
    },
    ThoiGianThanhToan: { type: Date, default: Date.now }
}, { timestamps: true });

export const ThanhToan = mongoose.model("ThanhToan", ThanhToanSchema);