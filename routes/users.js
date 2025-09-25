const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.post('/change-password', authenticate, userController.changePassword);
router.delete('/delete-account', authenticate, userController.deleteAccount);

// Admin only routes

router.get('/', authenticate, authorize('admin'), userController.getAllUsers);
router.get('/:id', authenticate, authorize('admin'), userController.getUserById);
router.put('/:id/role', authenticate, authorize('admin'), userController.updateUserRole);
router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser);

module.exports = router;