// backend/src/routes/orderRoutes.js
const express = require('express');
const Order = require('../db/orderModel'); // Adjust the path as needed

const router = express.Router();

const mapOrderData = (order) => {
  return {
    orderId: order.orderId,
    products: order.products,
    customerName: order.customerName,
    totalOrderValue: order.totalOrderValue,
    status: order.status,
    deliveryDetails: order.deliveryDetails,
    additionalInfo: order.additionalInfo
  };
}

// Generate dummy order data
const generateDummyOrder = () => {
  // DUMMY DATA GENERATION
  const dummyProducts = [
    {
      productName: 'Ice Cream',
      sku: 'FRO-0000',
      quantity: 2,
      sellingPrice: 34.35,
      totalPrice: 68.70
    },
    {
      productName: 'Frozen Pizza',
      sku: 'FRO-0001',
      quantity: 1,
      sellingPrice: 24.50,
      totalPrice: 24.50
    }
  ];

  return {
    orderId: `ORD-${Math.floor(Math.random() * 10000)}`,
    products: dummyProducts,
    customerName: 'John Doe',
    totalOrderValue: dummyProducts.reduce((sum, product) => sum + product.totalPrice, 0),
    status: 'Pending',
    deliveryDetails: {
      address: '123 Main St, Cityville',
      contactNumber: '+1234567890'
    },
    additionalInfo: {
      batchNumber: `BATCH-${Math.floor(Math.random() * 5000)}`,
      aisle: 'Frozen Storage',
      section: 'Dairy Section'
    }
  };
};

// Create a new order
router.post('/create', async (req, res) => {
  try {
    // Use dummy data for now, later replace with req.body
    const orderData = generateDummyOrder();
    
    const newOrder = new Order(orderData);
    await newOrder.save();

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
});

module.exports = router;