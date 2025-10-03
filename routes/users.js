const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Account identifier
 *         username:
 *           type: string
 *           description: User display name
 *         email:
 *           type: string
 *           description: Account email
 *         accountType:
 *           type: string
 *           enum: [administrator, shopper]
 *           description: Account privileges
 *         accountCreated:
 *           type: string
 *           format: date-time
 *         lastUpdated:
 *           type: string
 *           format: date-time
 *       example:
 *         id: "65a1b2c3d4e5f6a7b8c9d0e1"
 *         username: "Michael Chen"
 *         email: "michael.chen@email.com"
 *         accountType: "shopper"
 *         accountCreated: "2024-02-20T08:15:00.000Z"
 *         lastUpdated: "2024-02-20T08:15:00.000Z"
 * 
 *     UserUpdate:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           minLength: 3
 *           maxLength: 40
 *           required: false
 *         email:
 *           type: string
 *           format: email
 *           required: false
 *       example:
 *         username: "Michael Chen Updated"
 *         email: "michael.new@email.com"
 * 
 *     ChangePasswordRequest:
 *       type: object
 *       required:
 *         - currentPasscode
 *         - newPasscode
 *       properties:
 *         currentPasscode:
 *           type: string
 *           description: Existing passcode
 *         newPasscode:
 *           type: string
 *           minLength: 8
 *           description: New secure passcode (minimum 8 characters)
 *       example:
 *         currentPasscode: "currentSecure123"
 *         newPasscode: "newSecurePass456"
 * 
 *     DeleteAccountRequest:
 *       type: object
 *       required:
 *         - passcode
 *       properties:
 *         passcode:
 *           type: string
 *           description: Account passcode for verification
 *       example:
 *         passcode: "myAccountPass789"
 * 
 *     UpdateRoleRequest:
 *       type: object
 *       required:
 *         - accountType
 *       properties:
 *         accountType:
 *           type: string
 *           enum: [administrator, shopper]
 *           description: New account type
 *       example:
 *         accountType: "administrator"
 * 
 *     UsersResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           example: true
 *         info:
 *           type: string
 *           example: "User accounts retrieved"
 *         result:
 *           type: object
 *           properties:
 *             accounts:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserProfile'
 *             navigation:
 *               type: object
 *               properties:
 *                 current:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 6
 *                 totalAccounts:
 *                   type: integer
 *                   example: 60
 *                 hasNext:
 *                   type: boolean
 *                   example: true
 *                 hasPrevious:
 *                   type: boolean
 *                   example: false
 * 
 *     UserResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           example: true
 *         info:
 *           type: string
 *           example: "Account details loaded"
 *         result:
 *           type: object
 *           properties:
 *             account:
 *               $ref: '#/components/schemas/UserProfile'
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
 *   name: Account Management
 *   description: User account operations and administration
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Retrieve account information
 *     tags: [Account Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account data retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *             examples:
 *               success:
 *                 summary: Account information loaded
 *                 value:
 *                   status: true
 *                   info: "Account details loaded successfully"
 *                   result:
 *                     account:
 *                       id: "65a1b2c3d4e5f6a7b8c9d0e1"
 *                       username: "Michael Chen"
 *                       email: "michael.chen@email.com"
 *                       accountType: "shopper"
 *                       accountCreated: "2024-02-20T08:15:00.000Z"
 *                       lastUpdated: "2024-02-20T08:15:00.000Z"
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
router.get('/profile', authenticate, userController.getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Modify account details
 *     tags: [Account Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *           examples:
 *             updateUsername:
 *               summary: Change display name
 *               value:
 *                 username: "Mike Chen"
 *             updateEmail:
 *               summary: Update email address
 *               value:
 *                 email: "mike.chen@newemail.com"
 *             updateBoth:
 *               summary: Update both name and email
 *               value:
 *                 username: "Mike Chen"
 *                 email: "mike.chen@newemail.com"
 *     responses:
 *       200:
 *         description: Account updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Input validation failed or email exists
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
router.put('/profile', authenticate, userController.updateProfile);

/**
 * @swagger
 * /api/users/change-password:
 *   post:
 *     summary: Update account passcode
 *     tags: [Account Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *           examples:
 *             changePasscode:
 *               summary: Update passcode example
 *               value:
 *                 currentPasscode: "oldSecurePass123"
 *                 newPasscode: "newSecurePass456"
 *     responses:
 *       200:
 *         description: Passcode updated
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
 *                   example: "Passcode changed successfully"
 *       400:
 *         description: Validation failed or incorrect current passcode
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               wrongPasscode:
 *                 summary: Current passcode incorrect
 *                 value:
 *                   status: false
 *                   error: "The current passcode is incorrect"
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
router.post('/change-password', authenticate, userController.changePassword);

/**
 * @swagger
 * /api/users/delete-account:
 *   delete:
 *     summary: Remove account permanently
 *     tags: [Account Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteAccountRequest'
 *           examples:
 *             removeAccount:
 *               summary: Delete account example
 *               value:
 *                 passcode: "mySecurePassword123"
 *     responses:
 *       200:
 *         description: Account removed
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
 *                   example: "Account deleted successfully"
 *       400:
 *         description: Validation failed or incorrect passcode
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
router.delete('/delete-account', authenticate, userController.deleteAccount);

// Administrator only routes

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve all user accounts (Administrator only)
 *     tags: [Account Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 15
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by username or email
 *       - in: query
 *         name: accountType
 *         schema:
 *           type: string
 *           enum: [administrator, shopper]
 *         description: Filter by account type
 *     responses:
 *       200:
 *         description: Accounts retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersResponse'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Administrator access required
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
router.get('/', authenticate, authorize('admin'), userController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get specific account details (Administrator only)
 *     tags: [Account Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Account identifier
 *     responses:
 *       200:
 *         description: Account information retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Administrator access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Account not found
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
router.get('/:id', authenticate, authorize('admin'), userController.getUserById);

/**
 * @swagger
 * /api/users/{id}/role:
 *   put:
 *     summary: Modify account privileges (Administrator only)
 *     tags: [Account Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Account identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoleRequest'
 *           examples:
 *             grantAdmin:
 *               summary: Grant administrator access
 *               value:
 *                 accountType: "administrator"
 *             setShopper:
 *               summary: Set as shopper account
 *               value:
 *                 accountType: "shopper"
 *     responses:
 *       200:
 *         description: Account type updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Validation failed or self-modification attempt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               selfChange:
 *                 summary: Cannot modify own account type
 *                 value:
 *                   status: false
 *                   error: "You cannot modify your own account privileges"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Administrator access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Account not found
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
router.put('/:id/role', authenticate, authorize('admin'), userController.updateUserRole);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Remove user account (Administrator only)
 *     tags: [Account Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Account identifier
 *     responses:
 *       200:
 *         description: Account removed
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
 *                   example: "User account deleted successfully"
 *       400:
 *         description: Cannot remove own account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               selfRemoval:
 *                 summary: Cannot delete own account
 *                 value:
 *                   status: false
 *                   error: "You cannot remove your own account"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Administrator access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Account not found
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
router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser);

module.exports = router;