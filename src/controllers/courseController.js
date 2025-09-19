const { Course, Organization, Brand } = require('../models');
const { Op } = require('sequelize');

async function createCourse(req, res) {
  try {
    const { title, description, content, brandId, status } = req.body;
    const { userId, organizationId } = req.context;

    // Validate brandId belongs to the organization
    if (brandId) {
      const { Brand } = require('../models');
      const brand = await Brand.findOne({
        where: { id: brandId, organizationId }
      });
      
      if (!brand) {
        return res.status(400).json({
          success: false,
          error: 'Brand not found or does not belong to your organization'
        });
      }
    }

    const course = await Course.create({
      title,
      description,
      content,
      organizationId,
      brandId: brandId || null,
      status: status || 'draft',
      createdBy: userId,
      updatedBy: userId
    });

    // Fetch the created course with associations
    const createdCourse = await Course.findByPk(course.id, {
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

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: createdCourse,
      context: {
        organization: req.context.organization.name,
        brand: createdCourse.brand ? createdCourse.brand.name : 'Direct Organization Courses'
      }
    });

  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create course'
    });
  }
}

/**
 * Update an existing course
 */
async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const { title, description, content, brandId, status } = req.body;
    const { userId, organizationId } = req.context;

    // Find the course
    const course = await Course.findOne({
      where: {
        id,
        organizationId,
        isActive: true
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found or access denied'
      });
    }

    // Validate brandId if provided
    if (brandId) {
      const { Brand } = require('../models');
      const brand = await Brand.findOne({
        where: { id: brandId, organizationId }
      });
      
      if (!brand) {
        return res.status(400).json({
          success: false,
          error: 'Brand not found or does not belong to your organization'
        });
      }
    }

    // Update the course
    await course.update({
      title: title || course.title,
      description: description !== undefined ? description : course.description,
      content: content !== undefined ? content : course.content,
      brandId: brandId !== undefined ? brandId : course.brandId,
      status: status || course.status,
      updatedBy: userId
    });

    // Fetch the updated course with associations
    const updatedCourse = await Course.findByPk(course.id, {
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

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse,
      context: {
        organization: req.context.organization.name,
        brand: updatedCourse.brand ? updatedCourse.brand.name : 'Direct Organization Courses'
      }
    });

  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update course'
    });
  }
}

/**
 * Delete a course (soft delete)
 */
async function deleteCourse(req, res) {
  try {
    const { id } = req.params;
    const { userId, organizationId } = req.context;

    // Find the course
    const course = await Course.findOne({
      where: {
        id,
        organizationId,
        isActive: true
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found or access denied'
      });
    }

    // Soft delete the course
    await course.softDelete();

    res.json({
      success: true,
      message: 'Course deleted successfully',
      data: {
        id: course.id,
        title: course.title,
        deletedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete course'
    });
  }
}

/**
 * Restore a soft-deleted course
 */
async function restoreCourse(req, res) {
  try {
    const { id } = req.params;
    const { userId, organizationId } = req.context;

    // Find the soft-deleted course
    const course = await Course.findOne({
      where: {
        id,
        organizationId,
        isActive: false
      },
      paranoid: false // Include soft-deleted records
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found or access denied'
      });
    }

    // Restore the course
    await course.restore();

    res.json({
      success: true,
      message: 'Course restored successfully',
      data: {
        id: course.id,
        title: course.title,
        restoredAt: new Date()
      }
    });

  } catch (error) {
    console.error('Error restoring course:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to restore course'
    });
  }
}

/**
 * Get courses by status
 */
async function getCoursesByStatus(req, res) {
  try {
    const { status } = req.params;
    const { organizationId, brandId } = req.context;

    let whereClause = {
      organizationId: organizationId,
      isActive: true,
      status: status
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
      attributes: ['id', 'title', 'description', 'status', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: courses,
      count: courses.length,
      status: status,
      context: {
        organization: req.context.organization.name,
        brand: req.context.brand ? req.context.brand.name : 'Direct Organization Courses'
      }
    });

  } catch (error) {
    console.error('Error fetching courses by status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch courses'
    });
  }
}

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
  searchCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  restoreCourse,
  getCoursesByStatus
};