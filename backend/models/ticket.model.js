import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true }, // mã vé
  paymentInfo: { type: String }, // thông tin thanh toán
  seatNumber: { type: String, required: true }, // chổ giữ xe
  licensePlate: { type: String, required: true }, // biển số xe
  ticketType: {
    enum: {
      values: ['online', 'onsite'],
      message: 'Ticket type is either: online or onsite',
    },
    type: String,
    default: 'online',
  }, // loại vé xe (online hoặc tại bãi xe)
  urlQRCode: { type: String }, // QRcode
  checkinTime: { type: Date, default: Date.now },
  checkoutTime: { type: Date, default: null },
  isUsed: { type: Boolean, default: false }, // trạng thái vé (đã sử dụng hay chưa)
  expiresAt: { type: Date, default: Date.now() + 60 * 60 * 1000 }, // thời gian hết hạn vé (1 tiếng sau khi tạo vé)
  createdAt: { type: Date, default: Date.now }, // thời gian tạo vé
  updatedAt: { type: Date, default: null }, // thời gian cập nhật vé
  createBy: { type: String, default: 'admin' }, // người tạo vé
});

const Ticket = mongoose.model('Ticket', TicketSchema);
export default Ticket;
