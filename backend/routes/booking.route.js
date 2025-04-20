import express from "express";
import { booking,deletebooking,updatebooking } from "../controllers/booking.controller.js";


const router = express.Router();

router.post("/booking", booking); // Đặt chỗ
router.post("/deletebooking",deletebooking); // Đặt chỗ
router.post("/updatebooking", updatebooking); // Đặt chỗ


export default router;