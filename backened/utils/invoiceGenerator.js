// backened/utils/invoiceGenerator.js
const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");

// Utility: Remove only unsupported glyphs (keep common Unicode like ₹)
function safeText(text = "") {
  try {
    return String(text).replace(/\p{Extended_Pictographic}/gu, "").trim();
  } catch {
    return String(text);
  }
}

async function generateInvoice(order) {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([600, 800]);

  // Load Unicode font
  const fontPath = path.join(__dirname, "..", "fonts", "DejaVuSans.ttf");
  let font;
  if (fs.existsSync(fontPath)) {
    const fontBytes = fs.readFileSync(fontPath);
    font = await pdfDoc.embedFont(fontBytes);
  } else {
    console.warn("⚠ Unicode font not found. Falling back to Helvetica.");
    font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  }

  const drawText = (text, x, y, size = 12) => {
    page.drawText(safeText(text), { x, y, size, font, color: rgb(0, 0, 0) });
  };

  // Header
  drawText("Invoice", 250, 770, 18);
  drawText(`Order #${order.id}`, 50, 740);
  drawText(`Date: ${new Date(order.createdAt).toLocaleString()}`, 50, 720);
  drawText(`Customer: ${order.customer?.name || "N/A"}`, 50, 700);
  drawText(`Address: ${order.customer?.address || "N/A"}`, 50, 680);
  drawText(`Phone: ${order.customer?.phone || "N/A"}`, 50, 660);

  drawText("Items:", 50, 630, 14);
  let y = 610;
  const items = order.items || [];

  items.forEach((it, idx) => {
    const line = `${idx + 1}. ${it.productName || it.product?.name || "N/A"} — ${it.quantity} x ₹${it.unitPrice} = ₹${it.lineTotal}`;
    drawText(line, 50, y);
    y -= 18;

    if (y < 80) {
      page = pdfDoc.addPage([600, 800]);
      y = 760;
    }
  });

  // Totals & info
  y -= 10;
  drawText(`Total Price: ₹${order.totalPrice}`, 50, y);
  drawText(`Brokerage: ₹${order.brokerage || 0}`, 50, y - 20);
  drawText(`Status: ${order.status}`, 50, y - 40);
  drawText(`Delivery: ${order.deliveryStatus || "N/A"}`, 50, y - 60);

  // Save PDF
  const invoiceDir = path.join(__dirname, "..", "invoices");
  if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir, { recursive: true });

  const invoicePath = path.join(invoiceDir, `invoice_${order.id}.pdf`);
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(invoicePath, pdfBytes);

  return invoicePath;
}

module.exports = generateInvoice;
