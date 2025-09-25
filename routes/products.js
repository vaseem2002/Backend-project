const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes
router.get('/', authenticate, productController.getProducts);
router.get('/:id', authenticate, productController.getProductById);

// Admin only routes
router.post('/', authenticate, authorize('admin'), productController.createProduct);
router.put('/:id', authenticate, authorize('admin'), productController.updateProduct);
router.delete('/:id', authenticate, authorize('admin'), productController.deleteProduct);

module.exports = router;