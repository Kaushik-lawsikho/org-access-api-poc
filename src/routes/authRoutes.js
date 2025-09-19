const express = require('express');
const { register, login, refreshToken, logout, getProfile } = require('../controllers/authController');
const { authenticateJWT } = require('../middleware/jwtAuth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

// Protected routes
router.get('/profile', authenticateJWT, getProfile);

module.exports = router;