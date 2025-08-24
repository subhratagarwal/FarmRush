// backend/routes/coupons.js
const express = require("express");
const router = express.Router();
const { Product, Order, User, Cart, Wishlist, Review, Farmer, FarmerRating, Coupon } = require('../config/db');


// Add a new coupon (admin or farmer)
router.post("/add", async (req, res) => {
  const { code, discountPercentage, minAmount, expiryDate } = req.body;
  try {
    const coupon = await Coupon.create({
      code,
      discountPercentage,
      minAmount,
      expiryDate,
    });
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Validate a coupon
router.post("/validate", async (req, res) => {
  const { code, totalAmount } = req.body;
  try {
    const coupon = await Coupon.findOne({ where: { code } });
    if (!coupon) return res.status(404).json({ message: "Invalid coupon code" });

    if (new Date() > new Date(coupon.expiryDate))
      return res.status(400).json({ message: "Coupon expired" });

    if (totalAmount < coupon.minAmount)
      return res.status(400).json({ message: `Minimum amount ₹${coupon.minAmount} required` });

    const discount = (coupon.discountPercentage / 100) * totalAmount;
    const finalAmount = totalAmount - discount;

    res.json({ valid: true, discount, finalAmount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
