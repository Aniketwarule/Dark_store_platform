// const express = require('express');

// const router = express.Router();

// router.post('/add', async (req, res) => {
//   const { name, price, description, image } = req.body;

//   try {
//     const product = await Product.create({
//       name,
//       price,
//       description,
//       image,
//     });

//     res.status(201).json(product);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to create product' });
//   }
// });

// router.get('/all', async (req, res) => {
//   try {
//     const products = await Product.findAll();

//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to get all products' });
//   }
// });

// router.get('/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const product = await Product.findByPk(id);

//     if (!product) {
//       res.status(404).json({ error: 'Product not found' });
//       return;
//     }

//     res.status(200).json(product);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to get product' });
//   }
// });

// router.put('/:id', async (req, res) => {
//   const { id } = req.params;
//   const { name, price, description, image } = req.body;

//   try {
//     const product = await Product.findByPk(id);

//     if (!product) {
//       res.status(404).json({ error: 'Product not found' });
//       return;
//     }

//     await product.update({
//       name,
//       price,
//       description,
//       image,
//     });

//     res.status(200).json(product);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to update product' });
//   }
// });

// router.delete('/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const product = await Product.findByPk(id);

//     if (!product) {
//       res.status(404).json({ error: 'Product not found' });
//       return;
//     }

//     await product.destroy();

//     res.status(200).json({ message: 'Product deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to delete product' });
//   }
// });

// module.exports = router;    