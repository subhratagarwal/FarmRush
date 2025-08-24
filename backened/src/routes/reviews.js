const express = require("express");
const router = express.Router();
const { Product, Order, User, Cart, Wishlist, Review, Farmer, FarmerRating, Coupon } = require('../config/db');

// POST review
router.post("/", async (req, res) => {
  try {
    const { rating, comment, userId, productId } = req.body;

    const newReview = await Review.create({ rating, comment, userId, productId });

    res.status(201).json(newReview);
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET reviews for a product
router.get("/product/:productId", async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { productId: req.params.productId },
      include: [{ model: User, attributes: ["name"] }],
    });

    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET average rating for a product
router.get("/average/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.findAll({ where: { productId } });

    if (reviews.length === 0) {
      return res.json({ averageRating: 0, totalReviews: 0 });
    }

    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = (total / reviews.length).toFixed(1);

    res.json({ averageRating, totalReviews: reviews.length });
  } catch (err) {
    console.error("Error calculating average rating:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
