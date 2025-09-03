// backend/routes/orders.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const generateInvoice = require("../../utils/invoiceGenerator");

const {
  sequelize,
  Product,
  Order,
  OrderItem,
  User,
  Cart,
  Coupon,
} = require("../config/db");

/**
 * Permission check for a user to view an order
 */
async function canViewOrder(order, user) {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (order.customerId === user.id) return true;
  if (user.role === "farmer") {
    const count = await OrderItem.count({
      where: { orderId: order.id, farmerId: user.id },
    });
    if (count > 0) return true;
  }
  return false;
}

/**
 * POST /api/orders/create
 */
router.post("/create", auth, async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const customerId = req.user.id;
    const { items, paymentMode = "COD", couponCode } = req.body;

    let resolvedItems = [];
    if (Array.isArray(items) && items.length > 0) {
      resolvedItems = items;
    } else {
      const cartItems = await Cart.findAll({
        where: { customerId },
        include: [{ model: Product, attributes: ["id", "name", "image", "price", "farmerId", "stock"] }],
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (!cartItems.length) {
        await t.rollback();
        return res.status(400).json({ message: "Cart is empty or no items provided" });
      }

      resolvedItems = cartItems.map(ci => ({
        productId: ci.Product.id,
        quantity: ci.quantity,
      }));
    }

    // Validate and compute subtotal
    let subtotal = 0;
    const productMap = new Map();
    for (const it of resolvedItems) {
      const product = await Product.findByPk(it.productId, {
        lock: t.LOCK.UPDATE,
        transaction: t,
      });
      if (!product) {
        await t.rollback();
        return res.status(400).json({ message: `Product not found: ${it.productId}` });
      }
      if (product.stock < it.quantity) {
        await t.rollback();
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      productMap.set(it.productId, product);
      subtotal += product.price * it.quantity;
    }

    // Optional coupon
    let discount = 0;
    let appliedCoupon = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ where: { code: couponCode, isActive: true }, transaction: t });
      if (!coupon) {
        await t.rollback();
        return res.status(400).json({ message: "Invalid coupon" });
      }
      const pct = coupon.discountPercent || 0;
      discount = Math.min(((pct / 100) * subtotal), coupon.maxDiscount || Number.MAX_SAFE_INTEGER);
      appliedCoupon = coupon;
    }

    const totalAmount = Math.max(subtotal - discount, 0);

    const order = await Order.create({
      customerId,
      totalPrice: totalAmount,
      status: "Pending",
      paymentMode,
      paymentStatus: paymentMode === "ONLINE" ? "Pending" : "Pending",
      deliveryStatus: "Processing",
    }, { transaction: t });

    // Create OrderItems & decrement stock
    const itemsPayload = [];
    for (const it of resolvedItems) {
      const p = productMap.get(it.productId);
      itemsPayload.push({
        orderId: order.id,
        productId: p.id,
        farmerId: p.farmerId || null,
        quantity: it.quantity,
        unitPrice: p.price,
        lineTotal: p.price * it.quantity,
        productName: p.name,
        productImage: p.image,
        brokerage: 0,
      });

      await Product.decrement({ stock: it.quantity }, { where: { id: p.id }, transaction: t });
    }

    await OrderItem.bulkCreate(itemsPayload, { transaction: t });

    if (!Array.isArray(items) || items.length === 0) {
      await Cart.destroy({ where: { customerId }, transaction: t });
    }

    if (appliedCoupon) {
      await appliedCoupon.increment('usedCount', { by: 1, transaction: t });
    }

    await t.commit();

    const responseItems = itemsPayload.map(i => ({
      name: i.productName,
      price: i.unitPrice,
      quantity: i.quantity,
      image: i.productImage,
      lineTotal: i.lineTotal,
    }));

    return res.status(201).json({
      message: "Order placed successfully",
      id: order.id,
      customerId,
      status: order.status,
      subtotal,
      discount,
      total: totalAmount,
      items: responseItems,
    });
  } catch (err) {
    console.error("Error placing order:", err);
    await t.rollback();
    res.status(500).json({ message: "Error placing order", error: err.message });
  }
});

/**
 * GET /api/orders/user
 */
router.get("/user", auth, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { customerId: req.user.id },
      include: [
        { model: OrderItem, as: "items", include: [{ model: Product, as: "product", attributes: ["name", "image", "price"] }] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(orders);
  } catch (err) {
    console.error("Failed to fetch user orders:", err);
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
});

/**
 * GET /api/orders/farmer
 */
router.get("/farmer", auth, async (req, res) => {
  try {
    const effectiveFarmerId = req.query.farmerId || (req.user.role === "farmer" ? req.user.id : null);
    if (!effectiveFarmerId) return res.status(400).json({ error: "Missing farmerId" });

    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          as: 'items',
          where: { farmerId: effectiveFarmerId },
          required: true,
          include: [
            { model: Product, as: 'product', attributes: ['name', 'image', 'price'] },
            { model: User, as: 'farmer', attributes: ['name', 'phone', 'address'] },
          ],
        },
        { model: User, as: "customer", attributes: ["name", "phone", "address"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    const formatted = orders.map(o => ({
      id: o.id,
      totalPrice: o.totalPrice,
      status: o.status,
      deliveryStatus: o.deliveryStatus,
      deliveryTime: o.deliveryTime,
      customerPhone: o.customer?.phone || "N/A",
      customerAddress: o.customer?.address || "N/A",
      customerName: o.customer?.name || "N/A",
      items: (o.items || []).map(it => ({
        productName: it.productName || it.product?.name,
        productImage: it.productImage || it.product?.image,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        lineTotal: it.lineTotal,
      })),
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Failed to fetch farmer orders:", err);
    res.status(500).json({ error: "Failed to fetch farmer orders" });
  }
});

/**
 * GET /api/orders
 * Admin: list all orders
 */
router.get("/", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  try {
    const orders = await Order.findAll({
      include: [
        { model: OrderItem, as: "items", include: [{ model: Product, as: "product", attributes: ["name", "image", "price"] }, { model: User, as: "farmer", attributes: ["name", "phone"] }] },
        { model: User, as: "customer", attributes: ["name", "phone"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).json({ error: "Failed to fetch all orders" });
  }
});

/**
 * GET /api/orders/:id
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: OrderItem, as: "items", include: [{ model: Product, as: "product" }, { model: User, as: "farmer", attributes: ["name", "phone", "address"] }] },
        { model: User, as: "customer", attributes: ["name", "phone", "address"] },
      ],
    });

    if (!order) return res.status(404).json({ error: "Order not found" });
    if (!(await canViewOrder(order, req.user))) return res.status(403).json({ error: "Forbidden" });

    res.json(order);
  } catch (err) {
    console.error("Error fetching order by ID:", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

/**
 * PUT /api/orders/:id
 */
router.put("/:id", auth, async (req, res) => {
  const { status, deliveryStatus, deliveryTime } = req.body;
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (req.user.role !== "admin" && req.user.role !== "farmer") return res.status(403).json({ error: "Forbidden" });

    if (status) order.status = status;
    if (deliveryStatus) order.deliveryStatus = deliveryStatus;
    if (deliveryTime) order.deliveryTime = deliveryTime;

    await order.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`order:${order.id}`).emit('order:update', {
        id: order.id,
        status: order.status,
        deliveryStatus: order.deliveryStatus,
        deliveryTime: order.deliveryTime,
      });
    }

    res.json({ message: "Order updated", order });
  } catch (err) {
    console.error("Failed to update order:", err);
    res.status(500).json({ error: "Failed to update order" });
  }
});

/**
 * GET /api/orders/:id/invoice
 */
router.get("/:id/invoice", auth, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: OrderItem, as: "items", include: [{ model: Product, as: "product" }] },
        { model: User, as: "customer", attributes: ["name", "phone", "address"] },
      ],
    });

    if (!order) return res.status(404).json({ error: "Order not found" });
    if (!(await canViewOrder(order, req.user))) return res.status(403).json({ error: "Forbidden" });

    const invoicePath = await generateInvoice(order);
    return res.download(invoicePath);
  } catch (err) {
    console.error("Invoice generation failed:", err);
    res.status(500).json({ error: "Failed to generate invoice" });
  }
});

module.exports = router;
