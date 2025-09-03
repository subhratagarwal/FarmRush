const express = require("express");
const router = express.Router();
const { Product, Order, User, Review } = require("../config/db");

// POST review (create new review)
router.post("/", async (req, res) => {
  try {
    const { rating, comment, userId, productId } = req.body;

    // Validate inputs
    if (!rating || !userId || !productId) {
      return res.status(400).json({ error: "Rating, userId, and productId are required" });
    }

    // Ensure rating is within 1–5
    const validRating = Math.min(Math.max(parseFloat(rating), 1), 5);

    // Check if user purchased the product (optional but recommended)
    const purchased = await Order.findOne({
      where: { userId, productId, status: "delivered" }
    });
    if (!purchased) {
      return res.status(403).json({ error: "You can only review products you have purchased" });
    }

    // Check for duplicate review by same user
    const existingReview = await Review.findOne({ where: { userId, productId } });
    if (existingReview) {
      return res.status(409).json({ error: "You have already reviewed this product" });
    }

    // Create the review
    const newReview = await Review.create({
      rating: validRating,
      comment,
      userId,
      productId,
    });

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
      order: [["createdAt", "DESC"]],
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

    const avgData = await Review.findOne({
      where: { productId },
      attributes: [
        [Review.sequelize.fn("AVG", Review.sequelize.col("rating")), "averageRating"],
        [Review.sequelize.fn("COUNT", Review.sequelize.col("id")), "totalReviews"],
      ],
      raw: true,
    });

    res.json({
      averageRating: parseFloat(avgData.averageRating || 0).toFixed(1),
      totalReviews: parseInt(avgData.totalReviews || 0, 10),
    });
  } catch (err) {
    console.error("Error calculating average rating:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT review (update)
router.put("/:id", async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id } = req.params;

    const review = await Review.findByPk(id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    const validRating = rating ? Math.min(Math.max(parseFloat(rating), 1), 5) : review.rating;

    review.rating = validRating;
    review.comment = comment || review.comment;
    await review.save();

    res.json(review);
  } catch (err) {
    console.error("Error updating review:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE review
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    await review.destroy();
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
