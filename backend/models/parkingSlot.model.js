import mongoose from 'mongoose';

const ParkingSlotSchema = new mongoose.Schema({
  slotNumber: { type: String, required: true, unique: true }, // A1, A2, B1, ...
  isBooked: { type: Boolean, default: false }, // true = đã được đặt, false = chưa được đặt
  bookedBy: { type: String, default: null }, // ID vé đã đặt (nếu có)
  licensePlate: { type: String, default: null }, // Biển số xe đang đỗ (nếu có)
});

const ParkingSlot = mongoose.model('ParkingSlot', ParkingSlotSchema);
export default ParkingSlot;
