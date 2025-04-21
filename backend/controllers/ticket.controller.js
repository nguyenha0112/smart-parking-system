import Ticket from '../models/ticket.model.js';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

export async function createTicket(req, res) {
  try {
    const { checkinTime, seatNumber, lisencePlate } = req.body; // lấy data từ request body
    const ticketId = uuidv4(); // Tạo ID vé ngẫu nhiên
    const qrCodeData = `Ticket ID: ${ticketId}, checkinTime: ${checkinTime}, Seat Number: ${seatNumber}, liscencePlate: ${lisencePlate}`; // Dữ liệu QR code
    const qrCodeUrl = await QRCode.toDataURL(qrCodeData); // Tạo URL QR code từ dữ liệu

    // tạo đối tượng vé mới và lưu vào db = method create() của mongoose
    const newTicket = await Ticket.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Ticket created successfully',
      data: newTicket,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
}

export async function getAllTickets(req, res) {
  try {
    // lấy tất cả vé từ db = method find() của mongoose
    const tickets = await Ticket.find();
    res.status(200).json({
      status: 'success',
      data: tickets,
    });
  } catch (error) {
    res.status(500).json({
      statys: 'fail',
      message: error.message,
    });
  }
}
