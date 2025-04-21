import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'TaiKhoan', required: true }, 
  title: { type: String, required: true }, 
  content: { type: String, required: true }, 
  read: { type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now }, 
});


export const Notification = mongoose.model('Notification', NotificationSchema);
