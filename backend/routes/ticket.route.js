import express from 'express';
import {
  createTicket,
  getAllTickets,
  //   getTicketById,
  //   updateTicketById,
  //   deleteTicketById,
} from '../controllers/ticket.controller.js';
//Router
const router = express.Router();

router.route('/').get(getAllTickets).post(createTicket);

// router
//   .route('/:id')
//   .get(getTicketById)
//   .patch(updateTicketById)
//   .delete(deleteTicketById);

export default router;
