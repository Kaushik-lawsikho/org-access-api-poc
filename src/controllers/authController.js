const { User } = require('../models');
const { generateTokens, verifyToken } = require('../utils/jwt');
const { Organization } = require('../models')
const { validatePassword } = require('../utils/password');

/**
 * Register a new user
 */
async function register(req, res) {
  try {
    const { name, email, password, firstName, lastName, phone, organizationId } = req.body;

    // Validate required fields
    if (!name || !email || !password || !organizationId) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, password, and organizationId are required'
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Password validation failed',
        details: passwordValidation.errors
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      firstName,
      lastName,
      phone,
      organizationId
    });

    // Generate tokens
    const tokens = generateTokens(user);

    // Update user with refresh token
    await user.update({ refreshToken: tokens.refreshToken });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        tokens
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
}

/**
 * Login user
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Update last login
    await user.update({ lastLoginAt: new Date() });

    // Generate tokens
    const tokens = generateTokens(user);

    // Update refresh token
    await user.update({ refreshToken: tokens.refreshToken });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        tokens
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
}

/**
 * Refresh access token
 */
async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken);
    
    // Find user
    const user = await User.findOne({ 
      where: { 
        id: decoded.id, 
        refreshToken: refreshToken,
        isActive: true 
      } 
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const tokens = generateTokens(user);

    // Update refresh token
    await user.update({ refreshToken: tokens.refreshToken });

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        user: user.toJSON(),
        tokens
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid refresh token'
    });
  }
}

/**
 * Logout user
 */
async function logout(req, res) {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Find user and clear refresh token
      const user = await User.findOne({ where: { refreshToken } });
      if (user) {
        await user.update({ refreshToken: null });
      }
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
}

/**
 * Get current user profile
 */
async function getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        include: [
          {
            model: Organization,
            as: 'organization',
            attributes: ['id', 'name', 'description']
          }
        ],
        attributes: { exclude: ['password', 'refreshToken'] }
      });
  
      res.json({
        success: true,
        data: {
          user
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get profile'
      });
    }
  }

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getProfile
};