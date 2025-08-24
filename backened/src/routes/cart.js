// src/routes/cart.js
const express = require("express");
const router = express.Router();
const { Product, Order, User, Cart, Wishlist, Review, Farmer, FarmerRating, Coupon } = require('../config/db');


// Add to cart
router.post("/", async (req, res) => {
  const { customerId, productId, quantity } = req.body;

  try {
    const existing = await Cart.findOne({ where: { customerId, productId } });
    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.json(existing);
    }

    const cartItem = await Cart.create({ customerId, productId, quantity });
    res.status(201).json(cartItem);
  } catch (err) {
    console.error("Cart add failed:", err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// Get cart items for customer
router.get("/:customerId", async (req, res) => {
  try {
    const items = await Cart.findAll({
      where: { customerId: req.params.customerId },
      include: [{ model: Product, attributes: ["name", "image", "price"] }],
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// Remove from cart
router.delete("/:id", async (req, res) => {
  try {
    await Cart.destroy({ where: { id: req.params.id } });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete cart item" });
  }
});

module.exports = router;
