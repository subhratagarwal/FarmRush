// replace the top imports:
const { Order, Product, User, FarmerRating, Coupon } = require('../config/db');

// and fix field names used in analytics to match your models:
exports.getPlatformAnalytics = async (req, res) => {
  try {
    const totalOrders = await Order.count();
    const totalRevenue = await Order.sum('totalPrice'); // your field
    const activeFarmers = await User.count({ where: { role: 'Farmer' } });
    const topProducts = await Product.findAll({
      limit: 5,
      order: [['stock', 'ASC']], // or by sales later via OrderItem sum
    });
    const couponsUsed = await Coupon.sum('usedCount').catch(() => 0);

    res.json({ totalOrders, totalRevenue, activeFarmers, topProducts, couponsUsed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};
