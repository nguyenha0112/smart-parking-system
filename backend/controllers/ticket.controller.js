import Ticket from '../models/ticket.model.js';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

// Tạo QR code và lưu vé
export async function createTicket(req, res, type) {
  try {
    const { licensePlate, ticketType, seatNumber } = req.body;

    const ticketId = uuidv4();
    const qrCodeData = `TicketID: ${ticketId}, LicensePlate: ${licensePlate}, TicketType: ${ticketType.toLowerCase()}, SeatNumber: ${seatNumber}`;
    const urlQRCode = await QRCode.toDataURL(qrCodeData);

    // tạo vé mới với thông tin từ request body và lưu vào db = create() của mongoose
    const ticket = await Ticket.create({
      ticketId,
      licensePlate,
      ticketType: ticketType.toLowerCase(), // chuyển đổi loại vé thành chữ thường
      seatNumber,
      urlQRCode,
    });

    return res.status(201).json({
      status: 'success',
      data: ticket,
    });
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
}

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

// // Tạo vé online
// export const createOnlineTicket = (req, res) => createTicket(req, res, 'online');

// // Tạo vé tại cổng
// export const createOnsiteTicket = (req, res) => createTicket(req, res, 'onsite');

// Xác minh vé khi quét mã QR
export const verifyTicket = async (req, res) => {
  try {
    const { urlQRCode } = req.body;
    if (!urlQRCode) {
      return res.status(400).json({ error: 'QR code data is required' });
    }
    const ticket = await Ticket.findOne({ urlQRCode });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (ticket.isUsed) {
      return res.status(400).json({ error: 'Ticket already used' });
    }

    ticket.isUsed = true;
    ticket.checkoutTime = new Date();
    await ticket.save();

    return res.status(200).json({
      status: 'Ticket verified successfully',
      data: ticket,
    });
  } catch (err) {
    console.error('Error verifying ticket:', err);
    return res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};
