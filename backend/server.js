import express from 'express';
import cookieParser from 'cookie-parser';

// import route
import authRoutes from './routes/auth.route.js';
import bookingRoutes from './routes/booking.route.js';

import { connectDB } from './config/bd.js';
import { ENV_VARS } from './config/envVars.js';

import { protect } from './middleware/protect.js';


const app = express();
const PORT = ENV_VARS.PORT;
// tao bien moi truong

app.use(cookieParser());
app.use(express.json()); 


app.use("/api/v1/auth", authRoutes); // tài khoản
app.use("/api/v1/booking",protect,bookingRoutes); // đặt chỗ



connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("Failed to connect to the database", err);
});

