const Joi = require('joi');

// Existing validations...
const registerValidation = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'customer').default('customer')
});

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const productValidation = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).required(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().min(0).required(),
  category: Joi.string().required(),
  tags: Joi.array().items(Joi.string()),
  imageUrl: Joi.string().uri().required()
});

const refreshTokenValidation = Joi.object({
  refreshToken: Joi.string().required()
});

// Add new user validations
const updateProfileValidation = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional()
});

const changePasswordValidation = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

const deleteAccountValidation = Joi.object({
  password: Joi.string().required()
});

const updateRoleValidation = Joi.object({
  role: Joi.string().valid('admin', 'customer').required()
});

module.exports = {
  registerValidation,
  loginValidation,
  productValidation,
  refreshTokenValidation,
  updateProfileValidation,
  changePasswordValidation,
  deleteAccountValidation,
  updateRoleValidation
};