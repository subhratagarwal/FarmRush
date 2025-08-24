// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

// Sequelize instance and models
const { sequelize } = require('./config/db');

// Route handlers
const userRoutcanes = require('./routes/users');
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
app.use('/api/invoice', invoiceRoutes); // changed from /api to /api/invoice
app.use('/api/farmer-ratings', farmerRatingsRoute);
app.use('/api/coupons', couponRoutes);
app.use('/api/live-tracking', liveTrackingRoutes);

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

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
