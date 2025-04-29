import mongoose from 'mongoose';
import ParkingSlot from '../models/parkingSlot.model.js';

// API tạo slot giữ xe mới
export const createParkingSlot = async (req, res) => {
  try {
    const { slotNumber } = req.body; // lấy số slot từ request body
    // Kiểm tra slotNumber đã tồn tại trong db chưa
    const existingSlot = await ParkingSlot.findOne({ slotNumber });
    if (existingSlot) {
      return res.status(400).json({
        status: 'fail',
        message: 'The slot exists in the system.',
      });
    }

    const slot = await ParkingSlot.create(req.body); // tạo slot mới với thông tin từ request body và lưu vào db = create() của mongoose
    return res.status(201).json({
      status: 'success',
      message: 'Create slot successfully',
      data: slot,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};
// Api lây tất cả slot giữ xe
export const getAllParkingSlots = async (req, res) => {
  try {
    const slots = await ParkingSlot.find(); // tìm tất cả các slot trong db
    return res.status(200).json({
      status: 'success',
      data: slots,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Lấy thông tin một chỗ đỗ xe bằng slotNumber
export const getParkingSlot = async (req, res) => {
  try {
    const { slotNumber } = req.params; // Có thể là _id hoặc slotNumber
    const slot = await ParkingSlot.findOne({ slotNumber }); // Tìm slot theo slotNumber

    if (!slot) {
      return res.status(404).json({ error: 'Parking slot not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Get Slot information successfully',
      data: slot,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Kiểm tra chỗ đỗ xe còn trống hay không
export const checkSlotAvailability = async (req, res) => {
  try {
    const { slotNumber } = req.params;
    const slot = await ParkingSlot.findOne({ slotNumber }); // Tìm slot theo slotNumber

    if (!slot) {
      return res.status(404).json({ error: 'Parking slot not found' });
    }

    res.status(200).json({
      status: 'success',
      isAvailable: !slot.isBooked, // Trả về true nếu còn trống
      message: slot.isBooked ? 'Slot is booked' : 'Slot is available',
      slot,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Xóa một chỗ đỗ xe
export const deleteParkingSlot = async (req, res) => {
  try {
    const { slotNumber } = req.params;
    const deletedSlot = await ParkingSlot.findOneAndDelete({
      slotNumber, // Tìm slot theo slotNumber và xóa nó
    });

    if (!deletedSlot) {
      return res.status(404).json({
        status: 'fail',
        message: 'Parking slot not found',
      });
    }

    res.status(204).json({
      success: true,
      message: 'Parking slot deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};
