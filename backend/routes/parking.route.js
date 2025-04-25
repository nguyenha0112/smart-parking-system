import express from "express";
import { addParking,deleteParking,updateParking,getAllParking } from "../controllers/parking.controller.js";
import { protectRoute, checkRole } from "../middleware/protectRoute.js";


const router = express.Router();


router.post("/addparking", protectRoute, checkRole(["manager", "admin"]), addParking);
router.post("/deleteparking", protectRoute, checkRole(["manager", "admin"]), deleteParking);
router.post("/updateparking", protectRoute, checkRole(["manager", "admin"]), updateParking);
router.get("/getallparking", protectRoute, checkRole(["admin"]), getAllParking);



export default router;