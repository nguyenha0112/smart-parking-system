import express from 'express';
import { createInvoice } from '../controllers/invoice.controller.js';
import { protectRoute, checkRole } from '../middleware/protectRoute.js';

const router = express.Router();

// Tạo hóa đơn thủ công (yêu cầu xác thực và vai trò admin)
router.post('/create', protectRoute, checkRole(['admin']), createInvoice);

export default router;