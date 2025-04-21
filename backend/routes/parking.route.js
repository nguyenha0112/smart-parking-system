import express from "express";
import { addParking,deleteParking,updateParking,getAllParking } from "../controllers/parking.controller.js";



const router = express.Router();

router.post("/addparking", addParking); // thêm bãi đỗ xe
router.post("/deleteparking",deleteParking); // xóa bãi đỗ xe
router.post("/updateparking", updateParking); // cập nhật bãi đỗ xe
router.get("/getallparking", getAllParking); // lấy tất cả bãi đỗ xe



export default router;