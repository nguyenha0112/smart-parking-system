// routes/parkingSlotRoutes.js
import express from 'express';
import {
  createParkingSlot,
  getAllParkingSlots,
  getParkingSlot,
  checkSlotAvailability,
  deleteParkingSlot,
} from '../controllers/parkingSlot.controller.js';
import { checkRole, protectRoute } from '../middleware/protectRoute.js';
const router = express.Router();

router
  .route('/')
  .get(protectRoute, checkRole(['staff', 'admin']), getAllParkingSlots)
  .post(protectRoute, checkRole(['staff', 'admin']), createParkingSlot); // Lấy tất cả chỗ đỗ xe và tạo chỗ đỗ xe mới
router
  .route('/:slotNumber')
  .get(protectRoute, checkRole(['staff', 'admin']), getParkingSlot)
  .delete(protectRoute, checkRole(['staff', 'admin']), deleteParkingSlot); // Lấy thông tin một chỗ đỗ xe bằng slotNumber
router.route('/:slotNumber/availability').get(checkSlotAvailability); // Kiểm tra chỗ đỗ xe còn trống hay không

export default router;
