const express = require("express");
const router = express.Router();
const { Product, Order, User, Cart, Wishlist, Review, Farmer, FarmerRating, Coupon } = require('../config/db');


// Get wishlist for a user
router.get("/:userId", async (req, res) => {
  try {
    const wishlist = await Wishlist.findAll({
      where: { userId: req.params.userId },
      include: [Product],
    });
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add to wishlist
router.post("/", async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const existing = await Wishlist.findOne({ where: { userId, productId } });
    if (existing) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    const wishlistItem = await Wishlist.create({ userId, productId });
    res.json(wishlistItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove from wishlist
router.delete("/", async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const deleted = await Wishlist.destroy({
      where: { userId, productId },
    });

    if (deleted) {
      res.json({ message: "Removed from wishlist" });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
