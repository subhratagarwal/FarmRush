const express = require('express');
const multer = require('multer');
const { Product, Order, User, Cart, Wishlist, Review, Farmer, FarmerRating, Coupon } = require('../config/db');

const axios = require("axios");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../../uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Download image from remote URL
async function downloadImage(imageUrl, filename) {
  const imagePath = path.join(__dirname, "../../uploads", filename);
  const response = await axios({
    url: imageUrl,
    method: "GET",
    responseType: "stream",
  });
  const writer = fs.createWriteStream(imagePath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(filename));
    writer.on("error", reject);
  });
}

// 📌 Create product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, farmerId, stock, imageUrl } = req.body;
    let image = null;

    if (imageUrl) {
      const filename = `${Date.now()}-remote.jpg`;
      await downloadImage(imageUrl, filename);
      image = `/uploads/${filename}`;
    } else if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock: stock || 100,
      farmerId,
      image
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('❌ Error creating product:', err);
    res.status(500).json({ error: 'Server error while creating product.' });
  }
});

// 📌 Get all products (marketplace)
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      include: {
        model: User,
        as: "farmer",
        attributes: ["name", "email", "phone", "address"],
      },
    });

    const updatedProducts = products.map((p) => ({
      ...p.dataValues,
      image: p.image ? `${req.protocol}://${req.get("host")}${p.image}` : null,
    }));

    res.json(updatedProducts);
  } catch (err) {
    console.error("Failed to fetch products:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 📌 Get products by farmer
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { farmerId: req.params.farmerId },
      include: {
        model: User,
        as: "farmer",
        attributes: ["id", "name", "email"]
      }
    });

    const updatedProducts = products.map((p) => ({
      ...p.dataValues,
      image: p.image ? `${req.protocol}://${req.get("host")}${p.image}` : null,
    }));

    res.json(updatedProducts);
  } catch (err) {
    console.error('❌ Error fetching farmer products:', err);
    res.status(500).send('Error fetching products');
  }
});

// 📌 Update product
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const prod = await Product.findByPk(req.params.id);
    if (!prod) return res.status(404).send('Not found');

    if (req.body.name) prod.name = req.body.name;
    if (req.body.price) prod.price = req.body.price;
    if (req.body.description) prod.description = req.body.description;
    if (req.body.stock) prod.stock = req.body.stock;

    if (req.body.imageUrl) {
      const filename = `${Date.now()}-updated.jpg`;
      await downloadImage(req.body.imageUrl, filename);
      prod.image = `/uploads/${filename}`;
    } else if (req.file) {
      prod.image = `/uploads/${req.file.filename}`;
    }

    await prod.save();
    res.json(prod);
  } catch (err) {
    console.error(err);
    res.status(500).send('Update failed');
  }
});

// 📌 Delete product
router.delete('/:id', async (req, res) => {
  try {
    const prod = await Product.findByPk(req.params.id);
    if (!prod) return res.status(404).send('Product not found');

    await prod.destroy();
    res.json({ message: '✅ Product deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting product:', err);
    res.status(500).send('Delete failed');
  }
});

module.exports = router;
