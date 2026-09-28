require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const Product = require('./models/Product');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const mongoUri =
  `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}` +
  `@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}` +
  `/${process.env.MONGO_DATABASE}?authSource=admin`;

// Kết nối MongoDB
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Health API
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'Product API is running'
  });
});

// CREATE - Thêm Product
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product({
      pid: req.body.pid,
      pname: req.body.pname,
      price: req.body.price,
      quantity: req.body.quantity
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({
      message: 'Error creating product',
      error: error.message
    });
  }
});

// READ - Lấy tất cả Product
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: 'Error getting products',
      error: error.message
    });
  }
});

// READ - Lấy Product theo pid
app.get('/api/products/:pid', async (req, res) => {
  try {
    const product = await Product.findOne({
      pid: req.params.pid
    });

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: 'Error getting product',
      error: error.message
    });
  }
});

// UPDATE - Cập nhật Product
app.put('/api/products/:pid', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { pid: req.params.pid },
      {
        pname: req.body.pname,
        price: req.body.price,
        quantity: req.body.quantity
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({
      message: 'Error updating product',
      error: error.message
    });
  }
});

// DELETE - Xóa Product
app.delete('/api/products/:pid', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      pid: req.params.pid
    });

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.status(200).json({
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting product',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Product API running on port ${PORT}`);
});