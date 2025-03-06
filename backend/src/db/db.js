const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  product_name: String,
  category: String,
  description: String,
  brand: String,
  supplier: String,
  SKU: { type: String, unique: true, sparse: true },
  barcode: { type: String, unique: true, sparse: true },
  stock_quantity: String,
  min_stock_level: String,
  reorder_alert: String,
  batch_number: String,
  expiry_date: String, // Use Date type if necessary
  cost_price: String,
  selling_price: String,
  discount: String,
  tax: String,
  aisle: String,
  bin: String,
  section: String,
  monthly_sales: String,
  average_demand: String,
  restock_threshold: String
}, { timestamps: true });

const Inventory = mongoose.model("inventory", inventorySchema);

module.exports = Inventory;
