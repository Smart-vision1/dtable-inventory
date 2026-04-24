const Movement = require('../models/Movement');
const Product = require('../models/Product');

const createMovement = async (req, res) => {
  try {
    const { productId, type, quantity, note } = req.body;

    if (!productId || !type || !quantity) {
      return res.status(400).json({ message: 'productId, type, and quantity are required.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (type === 'OUT') {
      if (product.quantity < quantity) {
        return res.status(400).json({
          message: 'Insufficient stock. Cannot go below zero.',
        });
      }
      product.quantity -= quantity;
    } else if (type === 'IN') {
      product.quantity += quantity;
    } else {
      return res.status(400).json({ message: 'Type must be IN or OUT.' });
    }

    product.updatedAt = new Date();
    await product.save();

    const movement = await Movement.create({
      product: productId,
      type,
      quantity,
      note,
      createdBy: req.user.id,
    });

    const populated = await movement.populate('product', 'name sku');

    res.status(201).json(populated);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error creating movement.' });
  }
};

const getMovements = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const { productId } = req.query;
    const skip = (page - 1) * limit;

    const query = productId ? { product: productId } : {};

    const [movements, totalMovements] = await Promise.all([
      Movement.find(query)
        .populate('product', 'name sku')
        .populate('createdBy', 'username')
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit),
      Movement.countDocuments(query),
    ]);

    res.json({
      movements,
      totalPages: Math.ceil(totalMovements / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching movements.' });
  }
};

module.exports = { createMovement, getMovements };
