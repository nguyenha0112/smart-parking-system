import express from 'express';
import cookieParser from 'cookie-parser';

// import route
import authRoutes from './routes/auth.route.js';
import ticketRoutes from './routes/ticket.route.js';
import accountManagerRoutes from './routes/accountManager.routes.js';
import bookingRoutes from './routes/booking.route.js';
import parkingRoutes from './routes/parking.route.js';

import { connectDB } from './config/bd.js';
import { ENV_VARS } from './config/envVars.js';

import { protectRoute, checkRole } from './middleware/protectRoute.js';

const app = express();
const PORT = ENV_VARS.PORT;

app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes); // tài khoản
app.use('/api/v1/ticket', ticketRoutes);
app.use('/api/v1/account', accountManagerRoutes);
app.use('/api/v1/booking', bookingRoutes); // đặt chỗ
app.use('/api/v1/parking', protectRoute, checkRole(['admin']), parkingRoutes);

console.log('MONGO_URI: ', process.env.MONGO_URI);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database', err);
  });
