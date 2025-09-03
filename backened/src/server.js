// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');

const healthRoutes = require("./routes/health");
// Sequelize instance and models
// Correct
const db = require('./config/db');
const sequelize = db.sequelize;


// Route handlers
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const wishlistRoutes = require("./routes/wishlist");
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require("./routes/cart");
const reviewRoutes = require("./routes/reviews");
const invoiceRoutes = require("./routes/invoice");
const farmerRatingsRoute = require("./routes/farmerRatings");
const couponRoutes = require("./routes/coupons");
const liveTrackingRoutes = require('./routes/liveTracking');

const app = express();
const server = http.createServer(app);

// ✅ Attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  socket.on('joinOrderRoom', (orderId) => {
    socket.join(`order:${orderId}`);
    console.log(`Client ${socket.id} joined room: order:${orderId}`);
  });
  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// ✅ Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/farmer-ratings', farmerRatingsRoute);
app.use('/api/coupons', couponRoutes);
app.use('/api/live-tracking', liveTrackingRoutes);
app.use("/api/health", healthRoutes);
// Optional: global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

// Database sync & authentication
sequelize.authenticate()
  .then(() => console.log('✅ DB connected'))
  .catch(err => console.error('❌ DB connection error:', err));

sequelize.sync({ alter: true })
  .then(() => console.log('✅ DB synced'))
  .catch(err => console.error('❌ Sync error:', err));

// Start server with Socket.IO
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend server is running successfully!',
    timestamp: new Date().toISOString(),
  });
});
