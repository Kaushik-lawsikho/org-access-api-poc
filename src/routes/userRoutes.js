const express = require('express');
const {
  getProfile,
  updateProfile,
  changePassword,
  getDashboard,
  searchUsers,
  getUserById,
  deactivateAccount
} = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/jwtAuth');
const { validate, validateQuery, userSchemas } = require('../middleware/validation');

const router = express.Router();

// All routes require JWT authentication
router.use(authenticateJWT);

// Profile management
router.get('/profile', getProfile);
router.put('/profile', validate(userSchemas.updateProfile), updateProfile);
router.put('/change-password', validate(userSchemas.changePassword), changePassword);

// Dashboard
router.get('/dashboard', getDashboard);

// User search and management
router.get('/search', validateQuery(userSchemas.search), searchUsers);
router.get('/:id', getUserById);

// Account management
router.delete('/account', deactivateAccount);

module.exports = router;