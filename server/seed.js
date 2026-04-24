const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Movement = require('./models/Movement');

const users = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'viewer', password: 'viewer123', role: 'viewer' },
];

const products = [
  {
    name: 'Laptop Pro 15',
    sku: 'ELEC-LP15-001',
    category: 'Electronics',
    price: 1299.99,
    quantity: 25,
    lowStockThreshold: 5,
  },
  {
    name: 'Wireless Mouse',
    sku: 'ELEC-WM-002',
    category: 'Electronics',
    price: 29.99,
    quantity: 4,
    lowStockThreshold: 10,
  },
  {
    name: 'Mechanical Keyboard',
    sku: 'ELEC-MK-003',
    category: 'Electronics',
    price: 89.99,
    quantity: 3,
    lowStockThreshold: 8,
  },
  {
    name: 'A4 Paper Ream (500 sheets)',
    sku: 'STAT-A4-001',
    category: 'Stationery',
    price: 8.99,
    quantity: 120,
    lowStockThreshold: 20,
  },
  {
    name: 'Ballpoint Pen Set (12pk)',
    sku: 'STAT-BP-002',
    category: 'Stationery',
    price: 5.49,
    quantity: 7,
    lowStockThreshold: 15,
  },
  {
    name: 'Sticky Notes Pack',
    sku: 'STAT-SN-003',
    category: 'Stationery',
    price: 3.99,
    quantity: 45,
    lowStockThreshold: 10,
  },
  {
    name: 'Bubble Wrap Roll 50m',
    sku: 'PACK-BW-001',
    category: 'Packaging',
    price: 24.99,
    quantity: 8,
    lowStockThreshold: 10,
  },
  {
    name: 'Cardboard Boxes (20pk)',
    sku: 'PACK-CB-002',
    category: 'Packaging',
    price: 18.99,
    quantity: 60,
    lowStockThreshold: 15,
  },
];

const runSeed = async () => {
  await User.deleteMany({});
  await Product.deleteMany({});
  await Movement.deleteMany({});

  const createdUsers = [];
  for (const userData of users) {
    const user = await User.create(userData);
    createdUsers.push(user);
    console.log(`[seed] Created user: ${user.username} (${user.role})`);
  }

  const adminUser = createdUsers.find((u) => u.role === 'admin');
  const createdProducts = await Product.insertMany(products);
  console.log(`[seed] Created ${createdProducts.length} products.`);

  const movements = [
    {
      product: createdProducts[0]._id,
      type: 'IN',
      quantity: 10,
      note: 'Initial stock delivery',
      createdBy: adminUser._id,
    },
    {
      product: createdProducts[1]._id,
      type: 'OUT',
      quantity: 6,
      note: 'Office distribution',
      createdBy: adminUser._id,
    },
    {
      product: createdProducts[3]._id,
      type: 'IN',
      quantity: 50,
      note: 'Monthly restock',
      createdBy: adminUser._id,
    },
    {
      product: createdProducts[6]._id,
      type: 'OUT',
      quantity: 2,
      note: 'Shipping department use',
      createdBy: adminUser._id,
    },
  ];

  await Movement.insertMany(movements);
  console.log(`[seed] Created ${movements.length} stock movements.`);
  console.log('[seed] Done. Credentials → admin:admin123 | viewer:viewer123');
};

// Called from server.js on startup — only seeds when DB is empty.
const seedIfEmpty = async () => {
  const count = await User.countDocuments();
  if (count > 0) {
    console.log('[seed] Data already exists — skipping auto-seed.');
    return;
  }
  console.log('[seed] Empty database detected — running auto-seed...');
  await runSeed();
};

// Allow running directly: node seed.js
if (require.main === module) {
  require('dotenv').config();
  const connectDB = require('./config/db');
  connectDB()
    .then(runSeed)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[seed] Error:', err);
      process.exit(1);
    });
}

module.exports = { seedIfEmpty };
