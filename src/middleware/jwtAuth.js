const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');

/**
 * JWT Authentication Middleware
 * Verifies JWT token and adds user to request context
 */
async function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        error: 'Access token required. Format: Bearer <token>' 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify the token
    const decoded = verifyToken(token);
    
    // Check if user still exists and is active
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password', 'refreshToken'] }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false,
        error: 'User not found or inactive' 
      });
    }

    // Add user to request context
    req.user = user;
    req.context = {
      userId: user.id,
      organizationId: user.organizationId,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('JWT Authentication error:', error);
    return res.status(401).json({ 
      success: false,
      error: 'Invalid or expired token' 
    });
  }
}

/**
 * Optional JWT Authentication Middleware
 * Similar to authenticateJWT but doesn't fail if no token provided
 */
async function optionalJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without authentication
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password', 'refreshToken'] }
    });

    if (user && user.isActive) {
      req.user = user;
      req.context = {
        userId: user.id,
        organizationId: user.organizationId,
        role: user.role
      };
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
}

module.exports = {
  authenticateJWT,
  optionalJWT
};