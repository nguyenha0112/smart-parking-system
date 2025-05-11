import express from 'express';
import cookieParser from 'cookie-parser';

// import route
import authRoutes from './routes/auth.route.js';
import ticketRoutes from './routes/ticket.route.js';
import accountManagerRoutes from './routes/accountManager.routes.js';
import bookingRoutes from './routes/booking.route.js';
import parkingRoutes from './routes/parking.route.js';
import parkingSlot from './routes/parkingSlot.route.js';

import { connectDB } from './config/bd.js';
import { ENV_VARS } from './config/envVars.js';

import { protectRoute, checkRole } from './middleware/protectRoute.js';
import { startTicketCheckoutJob } from './utils/autoCheckoutTicketOnline.js';

const app = express();
const PORT = ENV_VARS.PORT;

app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes); // tài khoản
app.use('/api/v1/ticket', ticketRoutes); // vé giữ xe
app.use('/api/v1/parkingSlot', parkingSlot); // chỗ đỗ xe
app.use('/api/v1/account', accountManagerRoutes);
app.use('/api/v1/booking', bookingRoutes); // đặt chỗ
app.use('/api/v1/parking', protectRoute, checkRole(['admin']), parkingRoutes);
console.log('connect', ENV_VARS.MONGO_URI);

// Auto checkout ticket online
startTicketCheckoutJob(); // Bắt đầu job tự động checkout vé online sau mỗi phút

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database', err);
  });
