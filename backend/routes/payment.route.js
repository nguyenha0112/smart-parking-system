import express from 'express';
import { processPayment } from '../controllers/payment.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

// Thanh toán hóa đơn (yêu cầu xác thực)
router.post('/process', protectRoute, processPayment);

export default router;