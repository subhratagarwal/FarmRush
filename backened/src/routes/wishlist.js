const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Wishlist, Product } = require("../config/db");

// GET /api/wishlist
router.get("/", auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product, as: "product", attributes: ["id", "name", "price", "image", "stock"] }],
    });
    res.json(wishlist);
  } catch (err) {
    console.error("Failed to fetch wishlist:", err);
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

// POST /api/wishlist/add
router.post("/add", auth, async (req, res) => {
  try {
    const { productId } = req.body;
    const [item, created] = await Wishlist.findOrCreate({
      where: { userId: req.user.id, productId },
    });
    if (!created) return res.status(400).json({ message: "Product already in wishlist" });
    res.json({ message: "Added to wishlist", item });
  } catch (err) {
    console.error("Failed to add to wishlist:", err);
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
});

// DELETE /api/wishlist/remove/:productId
router.delete("/remove/:productId", auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const deleted = await Wishlist.destroy({ where: { userId: req.user.id, productId } });
    if (!deleted) return res.status(404).json({ error: "Item not found in wishlist" });
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error("Failed to remove from wishlist:", err);
    res.status(500).json({ error: "Failed to remove from wishlist" });
  }
});

module.exports = router;
