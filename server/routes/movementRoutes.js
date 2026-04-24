const express = require('express');
const router = express.Router();
const { createMovement, getMovements } = require('../controllers/movementController');
const authMiddleware = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, adminOnly, createMovement);
router.get('/', authMiddleware, getMovements);

module.exports = router;
