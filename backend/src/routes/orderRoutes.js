// backend/src/routes/orderRoutes.js
const express = require('express');
const Order = require('../db/orderModel'); // Adjust the path as needed

const { faker } = require('@faker-js/faker');

const router = express.Router();

// Step 3: Define an array of names
const names = ["Alice Bob", "Bob Mason", "Charlie Chaplin", "David Kent", "Eva Queen", "Frank Mason", "Grace Smith", "Hannah Kevil", "Isaac Newton", "Jack Sparrow", "Karen Paige", "Leo Lesner", "Mona Salvator", "Nina Doberov", "Oscar Iassac", "Paul Rudd", "Quincy Stacy", "Rachel Green", "Sam Altman", "Tina Fey"];

// Step 4: Function to get a random name from the array
function getRandomName() {
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
}

// Step 5: Generate an array of 20 objects with index, random name, and random address
const objectsArray = Array.from({ length: 20 }, (_, index) => ({
  index: index,
  name: getRandomName(),
  address: faker.location.streetAddress() // Generates a random street address
}));

function getRandomdata() {
  const randomIndex = Math.floor(Math.random() * names.length);
  return objectsArray[randomIndex];
}

function getRandomnumber() {
  const randomIndex = Math.floor(Math.random() * 5) + 1;
  return randomIndex;
}

function getRandomprice() {
  const randomIndex = Math.floor(Math.random() * 30) + 1;
  return randomIndex;
}

// Generate dummy order data
const generateDummyOrder = () => {
  // DUMMY DATA GENERATION
  const dummyProducts = [
    {
      productName: 'Ice Cream',
      sku: 'FRO-0000',
      quantity: getRandomnumber(),
      sellingPrice: getRandomprice(),
      totalPrice: getRandomprice() * 2
    },
    {
      productName: 'Frozen Pizza',
      sku: 'FRO-0001',
      quantity: getRandomnumber(),
      sellingPrice: getRandomprice(),
      totalPrice: getRandomprice() * 2
    }
  ];

  const randomData = getRandomdata();

  return {
    orderId: `ORD-${Math.floor(Math.random() * 10000)}`,
    products: dummyProducts,
    customerName: randomData.name,
    totalOrderValue: dummyProducts.reduce((sum, product) => sum + product.totalPrice, 0),
    status: 'Pending',
    deliveryDetails: {
      address: randomData.address
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

router.get('/stats', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalOrderValue' },
        },
      },
    ]);
    const totalRevenue = totalRevenueResult[0]?.totalRevenue || 0;

    res.status(200).json({ totalOrders, totalRevenue });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({ message: 'Error fetching order stats', error: error.message });
  }
});

module.exports = router;