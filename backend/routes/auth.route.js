import express from "express";
import { signup, login, logout, updateAccount, deleteAccount , getAllAccounts } from "../controllers/auth.controller.js";

import { protectRoute ,checkRole } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signup); // Đăng ký
router.post("/login", login); // Đăng nhập
router.post("/logout", logout); // Đăng xuất
router.put("/update", protectRoute, checkRole(["customer", "manager", "admin"]), updateAccount); // Cập nhật tài khoản
router.delete("/delete", protectRoute, checkRole(["admin"]), deleteAccount); // Xóa tài khoản
router.get("/getall", protectRoute, checkRole(["admin"]), getAllAccounts); // Chỉ admin được phép lấy danh sách tài khoản

export default router;