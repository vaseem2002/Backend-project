const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User identifier
 *         username:
 *           type: string
 *           description: User display name
 *         email:
 *           type: string
 *           description: User email address
 *       example:
 *         id: "65a1b2c3d4e5f6a7b8c9d0e2"
 *         username: "Store Manager"
 *         email: "manager@store.com"
 * 
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - details
 *         - cost
 *         - quantity
 *         - type
 *         - photo
 *       properties:
 *         id:
 *           type: string
 *           description: Unique product identifier
 *         title:
 *           type: string
 *           description: Product title
 *         details:
 *           type: string
 *           description: Comprehensive product details
 *         cost:
 *           type: number
 *           format: float
 *           description: Product cost
 *         quantity:
 *           type: integer
 *           description: Available item count
 *         type:
 *           type: string
 *           description: Product classification
 *         labels:
 *           type: array
 *           items:
 *             type: string
 *           description: Product labels for filtering
 *         photo:
 *           type: string
 *           format: uri
 *           description: Product image URL
 *         addedBy:
 *           $ref: '#/components/schemas/User'
 *         isAvailable:
 *           type: boolean
 *           description: Product availability status
 *         dateAdded:
 *           type: string
 *           format: date-time
 *         lastModified:
 *           type: string
 *           format: date-time
 *       example:
 *         id: "65a1b2c3d4e5f6a7b8c9d0e1"
 *         title: "Samsung Galaxy S24 Ultra"
 *         details: "Premium Android smartphone with advanced AI features and telephoto lens"
 *         cost: 1299
 *         quantity: 35
 *         type: "Mobile Devices"
 *         labels: ["android", "samsung", "5g", "stylus"]
 *         photo: "https://cdn.store.com/images/galaxy-s24-ultra.jpg"
 *         isAvailable: true
 *         addedBy:
 *           id: "65a1b2c3d4e5f6a7b8c9d0e2"
 *           username: "Store Manager"
 *           email: "manager@store.com"
 *         dateAdded: "2024-03-10T14:20:00.000Z"
 *         lastModified: "2024-03-10T14:20:00.000Z"
 * 
 *     ProductCreate:
 *       type: object
 *       required:
 *         - title
 *         - details
 *         - cost
 *         - quantity
 *         - type
 *         - photo
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 120
 *         details:
 *           type: string
 *           minLength: 15
 *         cost:
 *           type: number
 *           minimum: 1
 *         quantity:
 *           type: integer
 *           minimum: 0
 *         type:
 *           type: string
 *         labels:
 *           type: array
 *           items:
 *             type: string
 *         photo:
 *           type: string
 *           format: uri
 *       example:
 *         title: "Sony WH-1000XM5 Headphones"
 *         details: "Industry-leading noise canceling wireless headphones with 30-hour battery"
 *         cost: 399
 *         quantity: 75
 *         type: "Audio Equipment"
 *         labels: ["wireless", "noise-canceling", "bluetooth", "premium"]
 *         photo: "https://cdn.store.com/images/sony-headphones.jpg"
 * 
 *     ProductUpdate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 120
 *         details:
 *           type: string
 *           minLength: 15
 *         cost:
 *           type: number
 *           minimum: 1
 *         quantity:
 *           type: integer
 *           minimum: 0
 *         type:
 *           type: string
 *         labels:
 *           type: array
 *           items:
 *             type: string
 *         photo:
 *           type: string
 *           format: uri
 *       example:
 *         title: "Sony WH-1000XM5 Wireless Headphones"
 *         details: "Updated model with improved noise cancellation and voice assistant"
 *         cost: 349
 *         quantity: 60
 * 
 *     ProductsResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           example: true
 *         info:
 *           type: string
 *           example: "Products loaded successfully"
 *         result:
 *           type: object
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *             pageInfo:
 *               type: object
 *               properties:
 *                 current:
 *                   type: integer
 *                   example: 1
 *                 pageCount:
 *                   type: integer
 *                   example: 8
 *                 totalItems:
 *                   type: integer
 *                   example: 80
 *                 nextPage:
 *                   type: boolean
 *                   example: true
 *                 previousPage:
 *                   type: boolean
 *                   example: false
 * 
 *     ProductResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           example: true
 *         info:
 *           type: string
 *           example: "Product details retrieved"
 *         result:
 *           type: object
 *           properties:
 *             item:
 *               $ref: '#/components/schemas/Product'
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           example: "Operation failed"
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Product inventory management operations
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve product inventory with filtering options
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Current page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 12
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search products by title or labels
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by product type
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title, cost, dateAdded, lastModified]
 *           default: dateAdded
 *         description: Sorting criteria
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sorting direction
 *     responses:
 *       200:
 *         description: Inventory data retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductsResponse'
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', authenticate, productController.getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get specific product details
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product identifier
 *     responses:
 *       200:
 *         description: Product information retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', authenticate, productController.getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Add new product to inventory (Manager only)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreate'
 *           examples:
 *             laptopExample:
 *               summary: Add gaming laptop
 *               value:
 *                 title: "ASUS ROG Strix Gaming Laptop"
 *                 details: "High-performance gaming laptop with RTX 4070 and 16GB RAM for immersive gaming"
 *                 cost: 1799
 *                 quantity: 15
 *                 type: "Computers"
 *                 labels: ["gaming", "laptop", "rtx", "gaming"]
 *                 photo: "https://cdn.store.com/images/asus-rog-laptop.jpg"
 *             tabletExample:
 *               summary: Add premium tablet
 *               value:
 *                 title: "iPad Pro 12.9-inch M2"
 *                 details: "Professional tablet with Liquid Retina XDR display and M2 chip for creative work"
 *                 cost: 1099
 *                 quantity: 40
 *                 type: "Tablets"
 *                 labels: ["apple", "tablet", "creative", "premium"]
 *                 photo: "https://cdn.store.com/images/ipad-pro.jpg"
 *     responses:
 *       201:
 *         description: Product added to inventory
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 info:
 *                   type: string
 *                   example: "Product added successfully"
 *                 result:
 *                   type: object
 *                   properties:
 *                     item:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         description: Input validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Manager privileges required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', authenticate, authorize('admin'), productController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Modify product information (Manager only)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdate'
 *           examples:
 *             discountUpdate:
 *               summary: Apply price discount
 *               value:
 *                 cost: 1599
 *                 quantity: 12
 *                 details: "Special discount for limited stock!"
 *             featureUpdate:
 *               summary: Update product features
 *               value:
 *                 title: "ASUS ROG Strix SCAR 16 Gaming Laptop"
 *                 details: "Updated with 240Hz display and mechanical keyboard for competitive gaming"
 *                 cost: 1999
 *                 quantity: 8
 *                 type: "Gaming Computers"
 *                 labels: ["gaming", "laptop", "rtx-4070", "mechanical-keyboard"]
 *                 photo: "https://cdn.store.com/images/asus-rog-scar.jpg"
 *     responses:
 *       200:
 *         description: Product updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 info:
 *                   type: string
 *                   example: "Product information updated"
 *                 result:
 *                   type: object
 *                   properties:
 *                     item:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid update data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Manager privileges required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', authenticate, authorize('admin'), productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Remove product from inventory (Manager only)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product identifier
 *     responses:
 *       200:
 *         description: Product removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 info:
 *                   type: string
 *                   example: "Product removed from inventory"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Manager privileges required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', authenticate, authorize('admin'), productController.deleteProduct);

module.exports = router;