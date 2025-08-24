const PDFDocument = require("pdfkit");
const Order = require("../models/Order"); // adjust path to your model

exports.generateInvoice = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findByPk(orderId, {
      include: ["customer", "farmer", "product"], // adjust relationships
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=invoice_${orderId}.pdf`);

    doc.fontSize(20).text("🧾 Invoice", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Order ID: ${order.id}`);
    doc.text(`Product: ${order.productName}`);
    doc.text(`Quantity: ${order.quantity} kg`);
    doc.text(`Total: ₹${order.totalPrice}`);
    doc.text(`Brokerage (5%): ₹${order.brokerage || order.totalPrice * 0.05}`);
    doc.moveDown();

    doc.text(`Customer: ${order.customer?.name || "N/A"}`);
    doc.text(`Phone: ${order.customer?.phone || "-"}`);
    doc.text(`Address: ${order.customer?.address || "-"}`);
    doc.moveDown();

    doc.text(`Farmer: ${order.farmer?.name || "N/A"}`);
    doc.text(`Phone: ${order.farmer?.phone || "-"}`);
    doc.text(`Address: ${order.farmer?.address || "-"}`);

    doc.end();
    doc.pipe(res);
  } catch (err) {
    console.error("Invoice generation error:", err);
    res.status(500).json({ error: "Failed to generate invoice" });
  }
};
