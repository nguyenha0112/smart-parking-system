import cron from 'node-cron';
import Ticket from '../models/ticket.model.js';
import mongoose from 'mongoose';
import ParkingSlot from '../models/parkingSlot.model.js';

// function xử lý vé hết hạn
const processExpiredTickets = async () => {
  const now = new Date();
  try {
    // Tìm các vé online đã hết hạn nhưng chưa được checkout
    const expiredTickets = await Ticket.find({
      ticketType: 'online',
      expiresAt: { $lte: now }, // Thời gian hết hạn vé <= thời gian hiện tại
      isActive: true,
    });

    console.log(`Found ${expiredTickets.length} expired tickets to process`);

    // Nếu không có vé nào hết hạn, không làm gì cả
    if (expiredTickets.length === 0) {
      console.log('No expired tickets found');
      return;
    }

    // Nếu có vé hết hạn, duyệt qua từng vé hết hạn
    for (const ticket of expiredTickets) {
      const session = await mongoose.startSession(); // Bắt đầu một phiên giao dịch mới
      session.startTransaction(); // Bắt đầu giao dịch

      try {
        // if (ticket.isActive) {
        //   await ParkingSlot.findOneAndUpdate(
        //     { slotNumber: ticket.slotNumber },
        //     {
        //       isBooked: false,
        //       bookedBy: null,
        //       licensePlate: null,
        //     },
        //     { session }
        //   );
        //   // Cập nhật vé (bỏ qua middleware)
        //   await Ticket.updateOne(
        //     { _id: ticket._id },
        //     {
        //       $set: {
        //         isActive: false,
        //         checkoutTime: new Date(),
        //       },
        //     },
        //     { session }
        //   );
        // }

        await ticket.releaseSlot(); // Giải phóng slot đã đặt cho vé hết hạn

        await session.commitTransaction();
        console.log(`Check-out Ticket: ${ticket.ticketId} , time: ${ticket.checkoutTime}`);
      } catch (error) {
        await session.abortTransaction();
        console.error(`Error checking out ticket ${ticket.ticketId}:`, error);
      } finally {
        session.endSession();
      }
    }
  } catch (error) {
    console.error('Error processing expired tickets:', error);
  }
};

// Lập lịch chạy mỗi phút để kiểm tra
export const startTicketCheckoutJob = () => {
  cron.schedule('* * * * *', processExpiredTickets);
  console.log('Ticket checkout started - running every minute');
};
