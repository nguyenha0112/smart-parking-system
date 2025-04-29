import mongoose from 'mongoose';
import ParkingSlot from './parkingSlot.model.js';

// Schema cho thông tin khách hàng thanh toán
const PaymentInfoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'TaiKhoan', default: null },
  userName: { type: String, default: null },
  // phương thưc thanh toán (tiền mặt hoặc chuyển khoản)
  paymentMethod: {
    type: String,
    enum: ['cash', 'banking'],
    // required: true,
  },
  transactionId: { type: String, default: 'null' }, // ID giao dịch
  fee: { type: Number }, // số tiền thanh toán
});

// Schema cho vé xe
const TicketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true }, // mã vé
  paymentInfo: PaymentInfoSchema, // thông tin thanh toán
  slotNumber: { type: String, required: true }, // chổ giữ xe
  licensePlate: { type: String, required: true }, // biển số xe
  ticketType: {
    // loại vé xe (online hoặc tại bãi xe)
    enum: {
      values: ['online', 'onsite'],
      message: 'Ticket type is either: online or onsite',
    },
    type: String,
    default: 'online',
  },
  duration: {
    // thời gian đỗ xe (tính bằng ngày) dành cho vé online
    type: Number,
    // required: true,
    min: 1,
    max: 30,
    default: null,
  },
  urlQRCode: { type: String }, // QRcode
  checkinTime: { type: Date, default: Date.now },
  checkoutTime: { type: Date, default: null },
  isActive: { type: Boolean, default: false }, // trạng thái vé
  expiresAt: { type: Date, default: null }, // thời gian hết hạn vé (1 tiếng sau khi tạo vé)
  createdAt: { type: Date, default: Date.now() }, // thời gian tạo vé
  updatedAt: { type: Date, default: Date.now() }, // thời gian cập nhật vé
  createBy: { type: String, default: 'admin' }, // người tạo vé là nhân viên nào?
});

// Middleware này sẽ được gọi trước khi vé được lưu vào cơ sở dữ liệu để cập nhật trạng thái chỗ đỗ
TicketSchema.pre('save', async function (next) {
  // Bắt đầu transaction

  try {
    // Tìm chỗ đỗ tương ứng với số chỗ đỗ trong vé để cập nhật trạng thái
    console.log('Middle ware pre save ticket:', this.licensePlate, this.slotNumber);

    const slot = await ParkingSlot.findOneAndUpdate(
      { slotNumber: this.slotNumber },
      { isBooked: true, licensePlate: this.licensePlate, bookedBy: this.ticketId },
      { new: true, runValidators: true, session: this.$session() } // new: true để trả về tài liệu đã cập nhật
    ); // sử dụng session để đảm bảo tính toàn vẹn của transaction

    // Nếu không tìm thấy chỗ đỗ, ném lỗi => sẽ xây dựng Middleware handle error
    if (!slot) {
      throw new Error('Parking slot not found!');
    }
    console.log('Slot booked:', slot.slotNumber, this.licensePlate);
    next(); // Nếu tìm thấy chỗ đỗ, tiếp tục lưu vé
  } catch (error) {
    next(error);
  }
});

// Middleware này sẽ được gọi trước khi vé được xóa khỏi cơ sở dữ liệu để cập nhật trạng thái chỗ đỗ
TicketSchema.methods.releaseSlot = async function () {
  try {
    // Kiểm tra vé đã được sử dụng chưa
    if (this.isActive) {
      await ParkingSlot.findOneAndUpdate(
        { slotNumber: this.slotNumber },
        {
          isBooked: false,
          bookedBy: null,
          licensePlate: null,
        },
        { session: this.$session() } // sử dụng session để đảm bảo tính toàn vẹn của transaction
      );
      await Ticket.updateOne(
        { _id: this._id },
        {
          $set: {
            isActive: false,
            checkoutTime: new Date(),
          },
        },
        { session: this.$session() }
      ); // Lưu vé đã cập nhật trạng thái
    }
  } catch (error) {
    console.error('Lỗi khi giải phóng slot:', error);
    throw error;
  }
};

const Ticket = mongoose.model('Ticket', TicketSchema);
export default Ticket;
