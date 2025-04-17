import mongoose from "mongoose";

const PhieuDenBuSchema = new mongoose.Schema({
    Xe: { type: mongoose.Schema.Types.ObjectId, ref: "Xe" },
    LoaiDenBu: { type: String, required: true },
    SoTienDenBu: { type: Number, required: true },
    NgayDenBu: { type: Date, required: true },
  });
  
  export const PhieuDenBu = mongoose.model("PhieuDenBu", PhieuDenBuSchema);
  