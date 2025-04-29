import express from 'express';
import { protectRoute, checkRole } from '../middleware/protectRoute.js'; // middleware kiểm tra quyền truy cập
import {
  createTicketOnline,
  getAllTicket,
  createTicketOnsite,
  checkoutByQR,
} from '../controllers/ticket.controller.js';

const router = express.Router();

router
  .route('/online')
  .post(protectRoute, checkRole(['customer', 'staff', 'admin']), createTicketOnline); // route API tạo vé online
router
  .route('/onsite')
  .post(protectRoute, checkRole(['staff', 'admin']), createTicketOnsite) // route API tạo vé tại chổ
  .patch(protectRoute, checkRole(['staff', 'admin']), checkoutByQR); // route API check-out vé onsite
router.route('/').get(protectRoute, checkRole(['admin', 'staff']), getAllTicket); // route API lấy tất cả vé
export default router;
