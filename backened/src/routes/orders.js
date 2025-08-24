const express = require("express");
const router = express.Router();
const generateInvoice = require("../../utils/invoiceGenerator");

const path = require("path");

const { Product, Order, User, Cart, Wishlist, Review, Farmer, FarmerRating, Coupon } = require('../config/db');




// POST /api/orders/checkout - Place a new order
// Checkout API
router.post("/checkout", async (req, res) => {
  try {
    const { customerId } = req.body;

    // Get all items from cart
    const cartItems = await Cart.findAll({
      where: { customerId },
      include: [Product]
    });

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total
    let totalAmount = 0;
    cartItems.forEach(item => {
      totalAmount += item.quantity * item.Product.price;
    });

    // Create order
    const order = await Order.create({
      customerId,
      status: "Pending",
      total: totalAmount
    });

    // Create order items
    const orderItems = [];
    for (let item of cartItems) {
      orderItems.push({
        orderId: order.id,
        productId: item.Product.id,
        quantity: item.quantity,
        price: item.Product.price
      });
    }
    await OrderItem.bulkCreate(orderItems);

    // Clear cart
    await Cart.destroy({ where: { customerId } });

    // Build response with product details
    const responseItems = cartItems.map(item => ({
      name: item.Product.name,
      price: item.Product.price,
      quantity: item.quantity,
      image: item.Product.image
    }));

    return res.json({
      message: "Order placed successfully",
      order: {
        id: order.id,
        customerId,
        status: order.status,
        total: totalAmount,
        items: responseItems
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error placing order", error: error.message });
  }
});


// GET /api/orders/customer - Get orders for a customer
router.get("/customer", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const orders = await Order.findAll({
      where: { customerId: userId },
      include: [
        { model: Product, as: "product", attributes: ["name", "image"] },
        { model: User, as: "farmer", attributes: ["phone", "address"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    const formatted = orders.map((o) => ({
      id: o.id,
      productName: o.product?.name,
      productImage: o.product?.image,
      quantity: o.quantity,
      totalPrice: o.totalPrice,
      brokerage: o.brokerage,
      status: o.status,
      deliveryStatus: o.deliveryStatus,
      deliveryTime: o.deliveryTime,
      farmerPhone: o.farmer?.phone || "N/A",
      farmerAddress: o.farmer?.address || "N/A",
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Failed to fetch customer orders:", err);
    res.status(500).json({ error: "Failed to fetch customer orders" });
  }
});

// GET /api/orders/farmer - Get orders for a farmer
router.get("/farmer", async (req, res) => {
  try {
    const { farmerId } = req.query;
    if (!farmerId) return res.status(400).json({ error: "Missing farmerId" });

    const orders = await Order.findAll({
      where: { farmerId },
      include: [
        { model: Product, as: "product", attributes: ["name", "image"] },
        { model: User, as: "customer", attributes: ["phone", "address"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    const formatted = orders.map((o) => ({
      id: o.id,
      productName: o.product?.name,
      productImage: o.product?.image,
      quantity: o.quantity,
      totalPrice: o.totalPrice,
      brokerage: o.brokerage,
      status: o.status,
      deliveryStatus: o.deliveryStatus,
      deliveryTime: o.deliveryTime,
      customerPhone: o.customer?.phone || "N/A",
      customerAddress: o.customer?.address || "N/A",
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Failed to fetch farmer orders:", err);
    res.status(500).json({ error: "Failed to fetch farmer orders" });
  }
});

// GET /api/orders/ - Get all orders (Admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: Product, as: "product", attributes: ["name", "image"] },
        { model: User, as: "farmer", attributes: ["name", "phone"] },
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

// GET /api/orders/:id - Get single order by ID (live tracking)
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: Product, as: "product" },
        { model: User, as: "farmer", attributes: ["name", "phone", "address"] },
        { model: User, as: "customer", attributes: ["name", "phone", "address"] },
      ],
    });

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json(order);
  } catch (err) {
    console.error("Error fetching order by ID:", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// DELETE /api/orders/:id - Cancel order
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.status !== "Pending") {
      return res.status(400).json({ error: "Only pending orders can be canceled" });
    }

    await order.destroy();
    res.json({ message: "Order canceled successfully" });
  } catch (err) {
    console.error("Error canceling order:", err);
    res.status(500).json({ error: "Failed to cancel order" });
  }
});

// PUT /api/orders/:id - Update order status/delivery
router.put("/:id", async (req, res) => {
  const { status, deliveryStatus, deliveryTime } = req.body;

  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (status) order.status = status;
    if (deliveryStatus) order.deliveryStatus = deliveryStatus;
    if (deliveryTime) order.deliveryTime = deliveryTime;

    await order.save();
    res.json({ message: "Order updated", order });
  } catch (err) {
    console.error("Failed to update order:", err);
    res.status(500).json({ error: "Failed to update order" });
  }
});

// GET /api/orders/user/:id - Get all orders by customer ID
router.get("/user/:id", async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { customerId: req.params.id },
      order: [["createdAt", "DESC"]],
    });

    res.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
});

// GET /api/orders/:id/invoice - Generate and download invoice
router.get("/:id/invoice", async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: Product, as: "product" },
        { model: User, as: "customer", attributes: ["name", "phone", "address"] },
      ],
    });

    if (!order) return res.status(404).json({ error: "Order not found" });

    const invoicePath = await generateInvoice(order);
    res.download(invoicePath);
  } catch (err) {
    console.error("Invoice generation failed:", err);
    res.status(500).json({ error: "Failed to generate invoice" });
  }
});

module.exports = router;
