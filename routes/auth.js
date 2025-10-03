const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique user identifier
 *         username:
 *           type: string
 *           description: User display name
 *         email:
 *           type: string
 *           description: User email address
 *         accountType:
 *           type: string
 *           enum: [administrator, shopper]
 *           description: User account type
 *       example:
 *         id: "65a1b2c3d4e5f6a7b8c9d0e1"
 *         username: "Sarah Johnson"
 *         email: "sarah.johnson@email.com"
 *         accountType: "shopper"
 * 
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           minLength: 3
 *           maxLength: 30
 *           description: User's display name
 *         email:
 *           type: string
 *           format: email
 *           description: Valid email address
 *         password:
 *           type: string
 *           minLength: 8
 *           description: Secure password (minimum 8 characters)
 *         accountType:
 *           type: string
 *           enum: [administrator, shopper]
 *           default: shopper
 *           description: Type of user account
 *       example:
 *         username: "Mike Wilson"
 *         email: "mike.wilson@email.com"
 *         password: "securePass123"
 *         accountType: "shopper"
 * 
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Registered email address
 *         password:
 *           type: string
 *           description: Account password
 *       example:
 *         email: "emma.davis@email.com"
 *         password: "myPassword456"
 * 
 *     RefreshTokenRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: Valid refresh token for obtaining new credentials
 *       example:
 *         refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
 * 
 *     AuthResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Authentication successful"
 *         userData:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *             accessToken:
 *               type: string
 *               description: JWT access token for API calls
 *             refreshToken:
 *               type: string
 *               description: JWT refresh token for token renewal
 * 
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Account created successfully"
 *         userData:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *             accessToken:
 *               type: string
 *               description: JWT access token
 *             refreshToken:
 *               type: string
 *               description: JWT refresh token
 * 
 *     RefreshTokenResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Access tokens updated successfully"
 *         tokens:
 *           type: object
 *           properties:
 *             accessToken:
 *               type: string
 *               description: New JWT access token
 *             refreshToken:
 *               type: string
 *               description: New JWT refresh token
 * 
 *     LogoutResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Signed out successfully"
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
 *   description: User account operations and authentication
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Create a new user account
 *     tags: [Account Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           examples:
 *             shopperAccount:
 *               summary: Create shopper account
 *               value:
 *                 username: "Lisa Thompson"
 *                 email: "lisa.thompson@email.com"
 *                 password: "shopperPass789"
 *                 accountType: "shopper"
 *             adminAccount:
 *               summary: Create administrator account
 *               value:
 *                 username: "Admin Robert"
 *                 email: "robert.admin@email.com"
 *                 password: "adminSecure321"
 *                 accountType: "administrator"
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *             examples:
 *               success:
 *                 summary: Account creation successful
 *                 value:
 *                   status: true
 *                   message: "Account created successfully"
 *                   userData:
 *                     user:
 *                       id: "65a1b2c3d4e5f6a7b8c9d0e1"
 *                       username: "Lisa Thompson"
 *                       email: "lisa.thompson@email.com"
 *                       accountType: "shopper"
 *                     accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
 *                     refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
 *       400:
 *         description: Validation error or duplicate account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validationError:
 *                 summary: Input validation failed
 *                 value:
 *                   status: false
 *                   error: "Email format is invalid"
 *               duplicateAccount:
 *                 summary: Account already exists
 *                 value:
 *                   status: false
 *                   error: "An account with this email already exists"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Sign in to user account
 *     tags: [Account Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             shopperLogin:
 *               summary: Shopper sign in
 *               value:
 *                 email: "david.miller@email.com"
 *                 password: "davidPass123"
 *             adminLogin:
 *               summary: Administrator sign in
 *               value:
 *                 email: "admin.jenny@email.com"
 *                 password: "jennyAdmin456"
 *     responses:
 *       200:
 *         description: Sign in successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             examples:
 *               success:
 *                 summary: Sign in successful
 *                 value:
 *                   status: true
 *                   message: "Sign in successful"
 *                   userData:
 *                     user:
 *                       id: "65b2c3d4e5f6a7b8c9d0e1f2"
 *                       username: "David Miller"
 *                       email: "david.miller@email.com"
 *                       accountType: "shopper"
 *                     accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
 *                     refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
 *       400:
 *         description: Input validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidCredentials:
 *                 summary: Invalid email or password
 *                 value:
 *                   status: false
 *                   error: "The provided credentials are incorrect"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Renew access tokens
 *     tags: [Account Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *           examples:
 *             tokenRefresh:
 *               summary: Refresh token example
 *               value:
 *                 refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
 *     responses:
 *       200:
 *         description: Tokens renewed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshTokenResponse'
 *             examples:
 *               success:
 *                 summary: Token refresh successful
 *                 value:
 *                   status: true
 *                   message: "Access tokens updated successfully"
 *                   tokens:
 *                     accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
 *                     refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
 *       400:
 *         description: Token validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidToken:
 *                 summary: Invalid refresh token
 *                 value:
 *                   status: false
 *                   error: "The provided refresh token is invalid"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/refresh-token', authController.refreshToken);


module.exports = router;