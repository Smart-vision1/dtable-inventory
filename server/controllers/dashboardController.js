const Product = require('../models/Product');
const Movement = require('../models/Movement');

const getDashboard = async (req, res) => {
  try {
    const [products, recentMovements] = await Promise.all([
      Product.find(),
      Movement.find()
        .populate('product', 'name sku')
        .populate('createdBy', 'username')
        .sort({ timestamp: -1 })
        .limit(10),
    ]);

    const totalProducts = products.length;

    const lowStockProducts = products.filter(
      (p) => p.quantity <= p.lowStockThreshold
    );

    const lowStockCount = lowStockProducts.length;

    const lowStockList = lowStockProducts.slice(0, 5).map((p) => ({
      _id: p._id,
      name: p.name,
      sku: p.sku,
      quantity: p.quantity,
      lowStockThreshold: p.lowStockThreshold,
    }));

    const totalStockValue = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );

    res.json({
      totalProducts,
      lowStockCount,
      lowStockProducts: lowStockList,
      recentMovements,
      totalStockValue: parseFloat(totalStockValue.toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching dashboard data.' });
  }
};

module.exports = { getDashboard };
