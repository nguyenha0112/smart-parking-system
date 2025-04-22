import express from "express";
import { booking,deletebooking,updatebooking } from "../controllers/booking.controller.js";
import { protectRoute, checkRole } from "../middleware/protectRoute.js";


const router = express.Router();


router.post("/booking", protectRoute, checkRole(["customer", "manager", "admin"]), booking);
router.post("/deletebooking", protectRoute, checkRole(["customer", "manager", "admin"]), deletebooking);
router.post("/updatebooking", protectRoute, checkRole(["customer", "manager", "admin"]), updatebooking);


export default router;