import express from 'express';
import { bookService } from '../controllers/service.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

// Đặt dịch vụ (yêu cầu xác thực)
router.post('/book', protectRoute, bookService);

export default router;