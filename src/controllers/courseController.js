const { Course, Organization, Brand } = require('../models');
const { Op } = require('sequelize');

// Get all courses for the authenticated organization/brand
async function getCourses(req, res) {
  try {
    const { organizationId, brandId } = req.context;
    
    let whereClause = {
      organizationId: organizationId,
      isActive: true
    };

    // If brandId exists, filter by brand; otherwise get organization-level courses
    if (brandId) {
      whereClause.brandId = brandId;
    } else {
      whereClause.brandId = null;
    }

    const courses = await Course.findAll({
      where: whereClause,
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
      attributes: ['id', 'title', 'description', 'createdAt', 'updatedAt']
    });

    res.json({
      success: true,
      data: courses,
      count: courses.length,
      context: {
        organization: req.context.organization.name,
        brand: req.context.brand ? req.context.brand.name : 'Direct Organization Courses'
      }
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch courses' 
    });
  }
}

// Get specific course by ID
async function getCourseById(req, res) {
  try {
    const { organizationId, brandId } = req.context;
    const { id } = req.params;

    let whereClause = {
      id: id,
      organizationId: organizationId,
      isActive: true
    };

    // If brandId exists, filter by brand; otherwise get organization-level courses
    if (brandId) {
      whereClause.brandId = brandId;
    } else {
      whereClause.brandId = null;
    }

    const course = await Course.findOne({
      where: whereClause,
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
      ]
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found or access denied'
      });
    }

    res.json({
      success: true,
      data: course,
      context: {
        organization: req.context.organization.name,
        brand: req.context.brand ? req.context.brand.name : 'Direct Organization Courses'
      }
    });

  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch course' 
    });
  }
}

// Search courses by title or description
async function searchCourses(req, res) {
  try {
    const { organizationId, brandId } = req.context;
    const { q, limit = 10, offset = 0 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query (q) is required'
      });
    }

    let whereClause = {
      organizationId: organizationId,
      isActive: true,
      [Op.or]: [
        { title: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } }
      ]
    };

    // If brandId exists, filter by brand; otherwise get organization-level courses
    if (brandId) {
      whereClause.brandId = brandId;
    } else {
      whereClause.brandId = null;
    }

    const courses = await Course.findAll({
      where: whereClause,
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
      attributes: ['id', 'title', 'description', 'createdAt', 'updatedAt'],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['title', 'ASC']]
    });

    res.json({
      success: true,
      data: courses,
      count: courses.length,
      query: q,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      },
      context: {
        organization: req.context.organization.name,
        brand: req.context.brand ? req.context.brand.name : 'Direct Organization Courses'
      }
    });

  } catch (error) {
    console.error('Error searching courses:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to search courses' 
    });
  }
}

module.exports = {
  getCourses,
  getCourseById,
  searchCourses
};