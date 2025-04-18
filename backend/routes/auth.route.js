import express from "express";
import { signup, login, logout, updateAccount, deleteAccount , getAllAccounts } from "../controllers/auth.controller.js";

import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update", protect, updateAccount); 
router.delete("/delete", protect, deleteAccount);
router.get("/getall", getAllAccounts);

export default router;