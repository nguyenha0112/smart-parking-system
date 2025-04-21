import express from 'express';
import { createTicket, getAllTicket } from '../controllers/ticket.controller.js';

const router = express.Router();

router.route('/').post(createTicket).get(getAllTicket);

export default router;
