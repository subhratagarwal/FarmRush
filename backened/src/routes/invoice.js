const express = require("express");
const router = express.Router();
const { generateInvoice } = require("../controllers/invoiceController");

router.get("/orders/:id/invoice", generateInvoice);

module.exports = router;
