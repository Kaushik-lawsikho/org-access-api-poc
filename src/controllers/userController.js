const { User, Organization, Brand, Course } = require('../models');
const { validatePassword } = require('../utils/password');
const { Op } = require('sequelize');

/**
 * Get user profile
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
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
}

/**
 * Update user profile
 */
async function updateProfile(req, res) {
  try {
    const { name, firstName, lastName, phone } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update user profile
    await user.update({
      name: name || user.name,
      firstName: firstName !== undefined ? firstName : user.firstName,
      lastName: lastName !== undefined ? lastName : user.lastName,
      phone: phone !== undefined ? phone : user.phone
    });

    // Fetch updated user with associations
    const updatedUser = await User.findByPk(userId, {
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
      message: 'Profile updated successfully',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
}

/**
 * Change user password
 */
async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Password validation failed',
        details: passwordValidation.errors
      });
    }

    // Update password
    await user.update({ password: newPassword });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to change password'
    });
  }
}

/**
 * Get user dashboard data
 */
async function getDashboard(req, res) {
  try {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;

    // Get user's created courses
    const createdCourses = await Course.findAll({
      where: {
        createdBy: userId,
        isActive: true
      },
      include: [
        {
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name']
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['id', 'name'],
          required: false
        }
      ],
      attributes: ['id', 'title', 'description', 'status', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Get course statistics
    const courseStats = await Course.findAll({
      where: {
        createdBy: userId,
        isActive: true
      },
      attributes: [
        'status',
        [Course.sequelize.fn('COUNT', Course.sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    // Get organization courses count
    const orgCoursesCount = await Course.count({
      where: {
        organizationId,
        isActive: true
      }
    });

    // Get user's updated courses
    const updatedCourses = await Course.findAll({
      where: {
        updatedBy: userId,
        isActive: true
      },
      include: [
        {
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name']
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['id', 'name'],
          required: false
        }
      ],
      attributes: ['id', 'title', 'description', 'status', 'updatedAt'],
      order: [['updatedAt', 'DESC']],
      limit: 5
    });

    res.json({
      success: true,
      data: {
        user: req.user,
        stats: {
          createdCourses: createdCourses.length,
          courseStatusBreakdown: courseStats,
          organizationCourses: orgCoursesCount
        },
        recentCreated: createdCourses,
        recentUpdated: updatedCourses
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data'
    });
  }
}

/**
 * Search users in the same organization
 */
async function searchUsers(req, res) {
  try {
    const { q, limit, offset, role } = req.query;
    const organizationId = req.user.organizationId;

    let whereClause = {
      organizationId,
      isActive: true
    };

    // Add search query if provided
    if (q) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${q}%` } },
        { email: { [Op.iLike]: `%${q}%` } },
        { firstName: { [Op.iLike]: `%${q}%` } },
        { lastName: { [Op.iLike]: `%${q}%` } }
      ];
    }

    // Add role filter if provided
    if (role) {
      whereClause.role = role;
    }

    const users = await User.findAll({
      where: whereClause,
      include: [
        {
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name']
        }
      ],
      attributes: { exclude: ['password', 'refreshToken'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: users,
      count: users.length,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      },
      context: {
        organization: req.user.organization.name
      }
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search users'
    });
  }
}

/**
 * Get user by ID (within same organization)
 */
async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const organizationId = req.user.organizationId;

    const user = await User.findOne({
      where: {
        id,
        organizationId,
        isActive: true
      },
      include: [
        {
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name', 'description']
        }
      ],
      attributes: { exclude: ['password', 'refreshToken'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found or access denied'
      });
    }

    res.json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
}

/**
 * Deactivate user account
 */
async function deactivateAccount(req, res) {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Deactivate account
    await user.update({ 
      isActive: false,
      refreshToken: null // Clear refresh token
    });

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Error deactivating account:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to deactivate account'
    });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getDashboard,
  searchUsers,
  getUserById,
  deactivateAccount
};