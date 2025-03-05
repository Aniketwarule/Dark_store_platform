const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  product_id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  category: String,
  description: String,
  brand: String,
  supplier: String,
  sku: String,
  barcode: String,
  stock_quantity: Number,
  min_stock_level: Number,
  reorder_alert: Boolean,
  batch_number: String,
  expiry_date: String, // Keeping as String to match "21-10-2025" format
  cost_price: Number,
  selling_price: Number,
  discount: Number,
  tax: Number,
  aisle: String,
  bin: String,
  section: String,
  monthly_sales: Number,
  average_demand: Number,
  restock_threshold: Number
});

const Inventory = mongoose.model('inventory', inventorySchema);

module.exports = Inventory;
