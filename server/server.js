// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const adminRoutes = require('./routes/adminRoutes');

const errorMiddleware = require('./middleware/errorMiddleware');
const loggerMiddleware = require('./middleware/loggerMiddleware');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// ======================
// TEST ROUTE
// ======================
app.get('/', (req, res) => {
  res.send(`
    <h1 style="color:green; text-align:center; margin-top:50px;">
      ✅ Calorie Tracker Backend is Running Successfully!
    </h1>
    <p style="text-align:center;">
      Server is listening on port <strong>${process.env.PORT || 5000}</strong>
    </p>
    <hr>
    <p style="text-align:center;">
      Backend is ready. Now run the React frontend on port 3000.
    </p>
  `);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});