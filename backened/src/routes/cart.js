const express = require("express");
const router = express.Router();
const { Cart, Product } = require("../config/db");
const auth = require("../middleware/auth");

// Add to cart
// Change from router.post("/") to:
router.post("/add", auth, async (req, res) => {
  const customerId = req.user.id;
  const { productId, quantity } = req.body;

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
router.get("/", auth, async (req, res) => {
  const customerId = req.user.id;
  try {
    const items = await Cart.findAll({
      where: { customerId },
      include: [{ model: Product, attributes: ["name", "image", "price"] }],
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// Remove from cart
router.delete("/:id", auth, async (req, res) => {
  const customerId = req.user.id;
  try {
    const deleted = await Cart.destroy({
      where: { id: req.params.id, customerId },
    });
    if (!deleted) return res.status(404).json({ error: "Cart item not found" });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete cart item" });
  }
});

module.exports = router;
