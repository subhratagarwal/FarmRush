const Order = require("../models/Order");
const Product = require("../models/Product");
const Farmer = require("../models/Farmer");
const Coupon = require("../models/Coupon");

exports.getPlatformAnalytics = async (req, res) => {
  try {
    const totalOrders = await Order.count();
    const totalRevenue = await Order.sum("totalAmount");
    const activeFarmers = await Farmer.count();
    const topProducts = await Product.findAll({
      limit: 5,
      order: [["orderCount", "DESC"]],
    });
    const couponsUsed = await Coupon.sum("usedCount");

    res.json({ totalOrders, totalRevenue, activeFarmers, topProducts, couponsUsed });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};
