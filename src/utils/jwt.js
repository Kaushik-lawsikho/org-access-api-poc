const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

/**
 * Generate JWT access token
 * @param {Object} payload - User data to encode
 * @returns {String} JWT token
 */
function generateAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'org-access-api',
    audience: 'org-access-api-users'
  });
}

/**
 * Generate JWT refresh token
 * @param {Object} payload - User data to encode
 * @returns {String} JWT refresh token
 */
function generateRefreshToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    issuer: 'org-access-api',
    audience: 'org-access-api-refresh'
  });
}

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Generate both access and refresh tokens
 * @param {Object} user - User object
 * @returns {Object} Object containing both tokens
 */
function generateTokens(user) {
  const payload = {
    id: user.id,
    email: user.email,
    organizationId: user.organizationId,
    role: user.role
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
    expiresIn: JWT_EXPIRES_IN
  };
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  generateTokens
};