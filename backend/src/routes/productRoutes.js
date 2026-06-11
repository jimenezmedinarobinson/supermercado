const express = require('express');
const productController = require('../controllers/productController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('admin', 'manager'), productController.createProduct);
router.get('/', authMiddleware, productController.getProducts);
router.get('/:id', authMiddleware, productController.getProductById);
router.put('/:id', authMiddleware, roleMiddleware('admin', 'manager'), productController.updateProduct);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), productController.deleteProduct);

module.exports = router;