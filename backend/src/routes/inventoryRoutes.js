const express = require('express');
const inventoryController = require('../controllers/inventoryController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/update', authMiddleware, roleMiddleware('admin', 'manager'), inventoryController.updateInventory);
router.get('/', authMiddleware, inventoryController.getInventory);
router.get('/low-stock', authMiddleware, inventoryController.getLowStockItems);
router.get('/:id', authMiddleware, inventoryController.getInventoryById);

module.exports = router;
