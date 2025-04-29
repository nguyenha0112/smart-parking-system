import express from 'express';
import { createSupport,getMySupport,getAllSupport,updateSupportStatus,chatbotReply } from '../controllers/supportCustomer.controller.js';
import { protectRoute, checkRole } from '../middleware/protectRoute.js';

const router = express.Router();

//user
router.post('/create', protectRoute, checkRole(['customer']),createSupport); 
router.get('/my', protectRoute, checkRole(['customer']),getMySupport); 

//admin
router.get('/all', protectRoute, checkRole(['admin']),getAllSupport); 
router.put('/support/:supportId', protectRoute, checkRole(['admin']), updateSupportStatus);

// chatbot
router.post('/chatbot', chatbotReply);

export default router;
