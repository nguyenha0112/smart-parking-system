import express from "express";
import {
  createInvoice,
  getInvoicesByUser,
  getInvoiceDetails
} from "../controllers/hoadon.controller.js";

const router = express.Router();

router.post("/create", createInvoice); // POST /api/hoadon/create
router.get("/user/:taiKhoanId", getInvoicesByUser); // GET /api/hoadon/user/:taiKhoanId
router.get("/detail/:hoaDonId", getInvoiceDetails); // GET /api/hoadon/detail/:hoaDonId

export default router;
