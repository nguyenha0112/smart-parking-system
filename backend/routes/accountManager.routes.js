
import express from "express";
import {
  saveHistory,
  getNotifications,
  saveFavoriteParking,
  createTestNotification
} from "../controllers/accountManager.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();


router.post('/history', protectRoute, saveHistory); // Lưu lịch sử
router.get('/notifications', protectRoute, getNotifications); // Lấy thông báo
router.post('/favorite-parking', protectRoute, saveFavoriteParking); // Lưu bãi đỗ yêu thích
router.post('/test-notification', protectRoute, createTestNotification); // Tạo thông báo mẫu (test)

export default router;