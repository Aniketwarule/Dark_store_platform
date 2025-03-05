const express = require('express');
const router = express.Router();
const Inventory = require('../db/db');

router.post('/add', async (req, res) => {
  const { product_id, name, category, description, brand, supplier, sku, barcode, stock, pricing, warehouse, order_data } = req.body;

  try {
    const inventory = await Inventory.create({
      product_id,
      name,
      category,
      description,
      brand,
      supplier,
      sku,
      barcode,
      stock,
      pricing,
      warehouse,
      order_data
    });

    res.status(201).json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create inventory' });
  }
});

router.get('/all', async (req, res) => {
  try {
    console.log('hii 1');
    const inventory = await Inventory.find();
    console.log('hii 2');
    res.status(200).json(inventory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to get all inventory', error });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const inventory = await Inventory.findByPk(id);

    if (!inventory) {
      res.status(404).json({ error: 'Inventory not found' });
      return;
    }

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get inventory' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { product_id, name, category, description, brand, supplier, sku, barcode, stock, pricing, warehouse, order_data } = req.body;

  try {
    const inventory = await Inventory.findByPk(id);

    if (!inventory) {
      res.status(404).json({ error: 'Inventory not found' });
      return;
    }

    await inventory.update({
      product_id,
      name,
      category,
      description,
      brand,
      supplier,
      sku,
      barcode,
      stock,
      pricing,
      warehouse,
      order_data
    });

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});

module.exports = router;

           