// utils/invoiceGenerator.js
const fs = require("fs");
const path = require("path");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

async function generateInvoice(order) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const drawText = (text, x, y, size = 12) => {
    page.drawText(text, {
      x,
      y,
      size,
      font,
      color: rgb(0, 0, 0),
    });
  };

  drawText("🧾 Invoice", 250, 380, 18);
  drawText(`Invoice for Order #${order.id}`, 50, 350);
  drawText(`Date: ${new Date(order.createdAt).toLocaleString()}`, 50, 330);
  drawText(`Customer: ${order.customer?.name || "N/A"}`, 50, 310);
  drawText(`Address: ${order.customer?.address || "N/A"}`, 50, 290);
  drawText(`Phone: ${order.customer?.phone || "N/A"}`, 50, 270);
  drawText(`Product: ${order.product?.name || "N/A"}`, 50, 250);
  drawText(`Quantity: ${order.quantity} kg`, 50, 230);
  drawText(`Total Price: ₹${order.totalPrice}`, 50, 210);
  drawText(`Brokerage: ₹${order.brokerage}`, 50, 190);
  drawText(`Status: ${order.status}`, 50, 170);
  drawText(`Delivery: ${order.deliveryStatus}`, 50, 150);

  const pdfBytes = await pdfDoc.save();

  const invoiceDir = path.join(__dirname, "../invoices");
  if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);

  const invoicePath = path.join(invoiceDir, `invoice_${order.id}.pdf`);
  fs.writeFileSync(invoicePath, pdfBytes);

  return invoicePath;
}

module.exports = generateInvoice;
