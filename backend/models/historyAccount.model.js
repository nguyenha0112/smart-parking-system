import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'TaiKhoan', required: true }, 
  action: { type: String, required: true }, 
  timestamp: { type: Date, default: Date.now }, 
});

export const History = mongoose.model('History', HistorySchema);
