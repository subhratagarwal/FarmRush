// routes/admin.js
const express = require("express");
const router = express.Router();
const { Product, Order, User, Cart, Wishlist, Review, Farmer, FarmerRating, Coupon } = require('../config/db');


// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll(); // Fetch all users
    res.json(users);
  } catch (err) {
    console.error("User fetch error:", err);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Get all orders with farmer and customer info
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, as: "farmer" },
        { model: User, as: "customer" },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(orders);
  } catch (err) {
    console.error("Order fetch error:", err);
    res.status(500).json({ error: "Error fetching orders" });
  }
});

router.get("/earnings", async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: User, as: "farmer" }],
    });

    const earningsMap = {};

    orders.forEach((order) => {
      const farmerId = order.farmer?.id;
      if (!farmerId) return;

      if (!earningsMap[farmerId]) {
        earningsMap[farmerId] = {
          name: order.farmer.name,
          email: order.farmer.email,
          totalEarnings: 0,
        };
      }

      earningsMap[farmerId].totalEarnings += order.brokerageFarmer || 0;
    });

    res.json(Object.values(earningsMap));
  } catch (err) {
    console.error("Earnings fetch error:", err);
    res.status(500).json({ error: "Error fetching earnings" });
  }
});


module.exports = router;
