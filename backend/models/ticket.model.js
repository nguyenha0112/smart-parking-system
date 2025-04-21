import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
  paymentInfo: { type: String }, // thông tin thanh toán
  seatNumber: { type: String, required: true }, // chổ giữ xe
  licensePlate: { type: String, required: true }, // biển số xe
  ticketType: { enum: ['online', 'onsite'], type: String, default: 'online' }, // loại vé xe (online hoặc tại bãi xe)
  QrCodeData: { type: String }, // QRcode
  checkinTime: { type: Date, default: Date.now },
  checkoutTime: { type: Date, default: null },
  isUsed: { type: Boolean, default: false }, // trạng thái vé (đã sử dụng hay chưa)
});

const Ticket = mongoose.model('Ticket', TicketSchema);
export default Ticket;
