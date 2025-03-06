// backend/src/db/orderModel.js
const mongoose = require('mongoose');

// Define the Order Schema
const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  products: [{
    productName: { type: String, required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
  }],
  customerName: { type: String, required: true },
  totalOrderValue: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  orderDate: { type: Date, default: Date.now },
  deliveryDetails: {
    address: { type: String },
    contactNumber: { type: String }
  },
  additionalInfo: {
    batchNumber: { type: String },
    aisle: { type: String },
    section: { type: String }
  }
}, { timestamps: true });

// Create and export the Order model
module.exports = mongoose.model('Order', OrderSchema);