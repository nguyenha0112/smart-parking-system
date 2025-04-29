import mongoose from 'mongoose';
import Ticket from '../models/ticket.model.js';
import QRCode from 'qrcode'; // thu vien
import ParkingSlot from '../models/parkingSlot.model.js'; // import model ParkingSlot
import { formatVND } from '../utils/featureOfTicket.js'; // import hàm formatVND để định dạng tiền tệ
// API tạo vé mới
export const createTicketOnline = async (req, res) => {
  const session = await mongoose.startSession(); // khởi tạo session cho transaction để đảm bảo tính toàn vẹn của dữ liệu
  session.startTransaction(); // bắt đầu transaction

  try {
    const {
      licensePlate,
      slotNumber,
      duration, // thời gian đỗ xe (tính bằng ngày) dành cho vé online
      transactionId,
      userId,
      ticketType = 'online',
    } = req.body; // biển số , số slot
    const ticketId = 'TICKET-' + Date.now().toString().slice(-6) + 'onl';
    const qrCodeData = JSON.stringify({
      ticketId: ticketId,
      licensePlate: licensePlate,
      ticketType: ticketType,
      slotNumber: slotNumber,
      userId: userId,
    });
    const urlQRCode = await QRCode.toDataURL(qrCodeData);

    // 1. Kiểm tra slot có trống không
    const slot = await ParkingSlot.findOne({ slotNumber: slotNumber, isBooked: false }).session(
      session
    );

    if (!slot) {
      throw new Error('Slot is booked');
    }

    // Tính tiền
    const fee = duration * 20000; // 20.000 VND cho mỗi giờ

    // tạo vé mới với lưu vào db

    const ticket = new Ticket({
      ticketId,
      licensePlate,
      paymentInfo: {
        userId: userId ? new mongoose.Types.ObjectId(userId) : null,
        paymentMethod: 'banking',
        fee,
        transactionId,
      },
      ticketType,
      duration,
      expiresAt: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
      checkoutTime: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
      isActive: true,
      slotNumber,
      urlQRCode,
    });

    // Lưu ticket và gọi middleware pre('save')
    await ticket.save({ session }); // session được truyền vào để đảm bảo tính toàn vẹn của transaction

    await session.commitTransaction(); // commit transaction nếu không có lỗi xảy ra
    return res.status(201).json({
      status: 'success',
      data: ticket,
    });
  } catch (err) {
    await session.abortTransaction(); // nếu có lỗi xảy ra thì rollback lại transaction
    return res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  } finally {
    session.endSession(); // kết thúc session
  }
};

// API tạo vé onsite
export const createTicketOnsite = async (req, res) => {
  const session = await mongoose.startSession(); // khởi tạo session cho transaction để đảm bảo tính toàn vẹn của dữ liệu
  session.startTransaction(); // bắt đầu transaction

  try {
    const { licensePlate, slotNumber, ticketType = 'onsite', createBy } = req.body; // biển số , số slot
    const ticketId = 'TICKET-' + Date.now().toString().slice(-6) + 'ons';
    const qrCodeData = JSON.stringify({
      ticketId: ticketId,
      licensePlate: licensePlate,
      ticketType: ticketType,
      slotNumber: slotNumber,
    });
    const urlQRCode = await QRCode.toDataURL(qrCodeData);

    // 1. Kiểm tra slot có trống không
    const slot = await ParkingSlot.findOne({ slotNumber: slotNumber, isBooked: false }).session(
      session
    );

    if (!slot) {
      throw new Error('Slot is booked');
    }

    // tạo vé mới với thông tin từ request body và lưu vào db = create() mongoose
    const ticket = await Ticket.create({
      ticketId,
      licensePlate,
      slotNumber,
      ticketType,
      urlQRCode,
      isActive: true,
      createBy: 'staff',
    });

    await session.commitTransaction(); // commit transaction nếu không có lỗi xảy ra
    return res.status(201).json({
      status: 'success',
      message: 'Tạo vé onsite thành công. Vui lòng thanh toán khi check-out',
      data: ticket,
    });
  } catch (err) {
    await session.abortTransaction(); // nếu có lỗi xảy ra thì rollback lại transaction
    return res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  } finally {
    session.endSession(); // kết thúc session
  }
};

// API check-out vé
export const checkoutByQR = async (req, res) => {
  const session = await mongoose.startSession(); // khởi tạo session cho transaction để đảm bảo tính toàn vẹn của dữ liệu
  session.startTransaction(); // bắt đầu transaction

  try {
    const { ticketId } = req.body; // lấy ticketId từ params\
    // Tìm vé trong database
    const ticket = await Ticket.findOne({
      ticketId,
      ticketType: 'onsite',
      isActive: true, // tìm vé onsite còn hiệu lực
    });
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Vé đã được check-out hoặc không tồn tại',
      });
    }

    // Cập nhật trạng thái slot về trống
    await ticket.releaseSlot(); // gọi phương thức releaseSlot để giải phóng slot

    // Tính toán thời gian và phí
    const fee = calculateParkingFee(ticket.checkinTime);

    // Cập nhật thông tin vé
    await ticket.updateOne({
      $set: {
        checkoutTime: new Date(),
        isUsed: true,
        updatedAt: new Date(),
        paymentInfo: {
          paymentMethod: 'cash',
          fee: fee,
          userId: ticket.userId || null,
        },
      },
    });

    await session.commitTransaction(); // commit transaction nếu không có lỗi xảy ra

    console.log('Check-out ticket:', ticketId, ticket.checkoutTime);
    res.status(200).json({
      success: true,
      message: 'Check-out thành công',
      data: {
        ticketId: ticket.ticketId,
        licensePlate: ticket.licensePlate,
        checkinTime: ticket.checkinTime,
        checkoutTime: ticket.checkoutTime,
        parkingHours: Math.floor((ticket.checkoutTime - ticket.checkinTime) / (1000 * 60 * 60)),
        fee: formatVND(fee),
        paymentMethod: ticket.paymentInfo.paymentMethod,
      },
    });
  } catch (error) {
    console.error('Lỗi khi xử lý check-out:', error);
    await session.abortTransaction(); // nếu có lỗi xảy ra thì rollback lại transaction
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi xử lý check-out',
      error: error.message,
    });
  } finally {
    session.endSession(); // kết thúc session
  }
};

// Tính phí đỗ xe
const calculateParkingFee = (checkinTime) => {
  const FIRST_HOUR = 20000.0; // 20.000 VND cho giờ đầu tiên
  const NEXT_HOURS = 15000.0; // 15.000 VND cho các giờ tiếp theo

  const checkoutTime = new Date(); // thời gian check-out
  const hours = Math.floor((checkoutTime - checkinTime) / (1000 * 60 * 60)); // Tính làm tròn số giờ giữa thời gian checkin và checkout
  if (hours <= 0) {
    return 0; // Nếu thời gian check-out nhỏ hơn thời gian check-in thì không tính phí
  }
  return hours === 1 ? FIRST_HOUR : FIRST_HOUR + (hours - 1) * NEXT_HOURS; // Tính phí đỗ xe
};

// API get tất cả vé
export async function getAllTicket(req, res) {
  try {
    const tickets = await Ticket.find({}).sort({ createdAt: -1 }); // tìm tất cả vé và sắp xếp theo thời gian tạo vé giảm dần
    return res.status(200).json({
      status: 'success',
      data: tickets,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
}

// // Xác minh vé khi quét mã QR
// export const checkTicket = async (req, res) => {
//   try {
//     const { urlQRCode } = req.body;
//     if (!urlQRCode) {
//       return res.status(400).json({ error: 'QR code data is required' });
//     }
//     const ticket = await Ticket.findOne({ urlQRCode });

//     if (!ticket) {
//       return res.status(404).json({ error: 'Ticket not found' });
//     }

//     if (ticket.isUsed) {
//       return res.status(400).json({ error: 'Ticket already used' });
//     }

//     ticket.isUsed = true;
//     ticket.checkoutTime = new Date();
//     await ticket.save();

//     return res.status(200).json({
//       status: 'Ticket verified successfully',
//       data: ticket,
//     });
//   } catch (err) {
//     console.error('Error verifying ticket:', err);
//     return res.status(500).json({
//       status: 'fail',
//       message: err.message,
//     });
//   }
// };
