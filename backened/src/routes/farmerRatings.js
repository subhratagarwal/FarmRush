// backend/src/routes/farmerRatings.js
const express = require("express");
const router = express.Router();
const { Product, Order, User, Cart, Wishlist, Review, Farmer, FarmerRating, Coupon } = require('../config/db');



router.post("/", async (req, res) => {
  const { rating, comment, userId, farmerId, orderId } = req.body;
  try {
    const newRating = await FarmerRating.create({
      rating,
      comment,
      userId,
      farmerId,
      orderId,
    });
    res.status(201).json(newRating);
  } catch (err) {
    res.status(500).json({ error: "Failed to submit rating" });
  }
});

router.get("/:farmerId", async (req, res) => {
  try {
    const ratings = await FarmerRating.findAll({
      where: { farmerId: req.params.farmerId },
      include: [{ model: User, attributes: ["name"] }],
    });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch ratings" });
  }
});

module.exports = router;
