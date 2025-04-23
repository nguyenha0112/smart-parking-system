import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'TaiKhoan', required: true }, 
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'closed'],
    default: 'pending',
  },
  adminReply: { 
    type: String,
    default: ''
  },
}, { timestamps: true });

export const SupportCustomer = mongoose.model('SupportCustomer', supportTicketSchema);
