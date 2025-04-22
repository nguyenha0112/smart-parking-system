
import express from "express";
import {
  saveHistory,
  getNotifications,
  saveFavoriteParking,
  createTestNotification
} from "../controllers/accountManager.controller.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();


router.post('/history', protect, saveHistory);
router.get('/notifications', protect, getNotifications);
router.post('/favorite-parking', protect, saveFavoriteParking);
router.post('/test-notification', protect, createTestNotification);

export default router;
