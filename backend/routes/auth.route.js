import express from "express";
import {
  signup,
  login,
  logout,
  updateAccount,
  deleteAccount,
  getAllAccounts,
  createAdminAccount
} from "../controllers/auth.controller.js";

import { protectRoute, checkRole } from "../middleware/protectRoute.js";

const router = express.Router();

// Auth routes
router.post("/signup", signup); // Đăng ký
router.post("/login", login);   // Đăng nhập
router.post("/logout", logout); // Đăng xuất

// Account management routes
router.put("/update", protectRoute, checkRole(["customer", "manager", "admin"]), updateAccount); // Cập nhật tài khoản
router.delete("/delete", protectRoute, checkRole(["admin"]), deleteAccount); // Xóa tài khoản
router.get("/getall", protectRoute, checkRole(["admin"]), getAllAccounts);   // Xem tất cả tài khoản

export default router;
