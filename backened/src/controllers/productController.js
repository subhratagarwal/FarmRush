
const Product = require('../models/product');

// ✅ Add product by farmer
exports.addProduct = async (req, res) => {
  try {
    const { name, description, pricePerKg, farmerId } = req.body;
    const product = await Product.create({ name, description, pricePerKg, farmerId });
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add product' });
  }
};

// ✅ Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};
