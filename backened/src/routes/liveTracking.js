const express = require("express");
const router = express.Router();
const { Product, Order, User, Cart, Wishlist, Review, Farmer, FarmerRating, Coupon } = require('../config/db');


// GET /api/livetracking/:orderId
router.get("/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Mocked status and ETA logic (replace with real-time tracking later)
    const statuses = ["Order Placed", "Preparing", "On the Way", "Delivered"];
    const index = Math.min(Math.floor(Math.random() * statuses.length), statuses.length - 1);
    const eta = `${10 + Math.floor(Math.random() * 15)} mins`;

    res.json({
      orderId: order.id,
      status: statuses[index],
      eta: eta,
      updatedAt: order.updatedAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
