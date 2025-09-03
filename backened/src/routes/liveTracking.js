const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Order, OrderItem } = require("../config/db");

router.get("/:orderId", auth, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Restrict access to customer, admin, or linked farmer
    let allowed = req.user.role === "admin" || req.user.id === order.customerId;
    if (!allowed && req.user.role === "farmer") {
      const count = await OrderItem.count({
        where: { orderId: order.id, farmerId: req.user.id },
      });
      allowed = count > 0;
    }
    if (!allowed) return res.status(403).json({ error: "Forbidden" });

    // Simple ETA calculation
    const createdAt = new Date(order.createdAt);
    const estimatedDeliveryTime = new Date(createdAt.getTime() + 30 * 60000); // +30 mins

    res.json({
      orderId: order.id,
      status: order.status,
      deliveryStatus: order.deliveryStatus,
      deliveryTime: order.deliveryTime || estimatedDeliveryTime,
    });
  } catch (err) {
    console.error("Live tracking failed:", err);
    res.status(500).json({ error: "Failed to fetch live tracking info" });
  }
});

module.exports = router;
