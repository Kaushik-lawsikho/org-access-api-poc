const Joi = require('joi');

/**
 * Course validation schemas
 */
const courseSchemas = {
  create: Joi.object({
    title: Joi.string().min(3).max(200).required().messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title must not exceed 200 characters',
      'any.required': 'Title is required'
    }),
    description: Joi.string().min(10).max(1000).optional().messages({
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description must not exceed 1000 characters'
    }),
    content: Joi.string().min(20).optional().messages({
      'string.min': 'Content must be at least 20 characters long'
    }),
    brandId: Joi.number().integer().positive().optional().messages({
      'number.base': 'Brand ID must be a number',
      'number.integer': 'Brand ID must be an integer',
      'number.positive': 'Brand ID must be positive'
    }),
    status: Joi.string().valid('draft', 'published', 'archived').default('draft').messages({
      'any.only': 'Status must be one of: draft, published, archived'
    })
  }),

  update: Joi.object({
    title: Joi.string().min(3).max(200).optional().messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title must not exceed 200 characters'
    }),
    description: Joi.string().min(10).max(1000).optional().messages({
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description must not exceed 1000 characters'
    }),
    content: Joi.string().min(20).optional().messages({
      'string.min': 'Content must be at least 20 characters long'
    }),
    brandId: Joi.number().integer().positive().optional().messages({
      'number.base': 'Brand ID must be a number',
      'number.integer': 'Brand ID must be an integer',
      'number.positive': 'Brand ID must be positive'
    }),
    status: Joi.string().valid('draft', 'published', 'archived').optional().messages({
      'any.only': 'Status must be one of: draft, published, archived'
    })
  }),

  search: Joi.object({
    q: Joi.string().min(1).max(100).required().messages({
      'string.min': 'Search query must be at least 1 character long',
      'string.max': 'Search query must not exceed 100 characters',
      'any.required': 'Search query is required'
    }),
    limit: Joi.number().integer().min(1).max(50).default(10).messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must not exceed 50'
    }),
    offset: Joi.number().integer().min(0).default(0).messages({
      'number.base': 'Offset must be a number',
      'number.integer': 'Offset must be an integer',
      'number.min': 'Offset must be at least 0'
    }),
    status: Joi.string().valid('draft', 'published', 'archived').optional().messages({
      'any.only': 'Status must be one of: draft, published, archived'
    })
  })
};

/**
 * User validation schemas
 */
const userSchemas = {
    updateProfile: Joi.object({
      name: Joi.string().min(2).max(100).optional().messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name must not exceed 100 characters'
      }),
      firstName: Joi.string().min(2).max(50).optional().messages({
        'string.min': 'First name must be at least 2 characters long',
        'string.max': 'First name must not exceed 50 characters'
      }),
      lastName: Joi.string().min(2).max(50).optional().messages({
        'string.min': 'Last name must be at least 2 characters long',
        'string.max': 'Last name must not exceed 50 characters'
      }),
      phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional().messages({
        'string.pattern.base': 'Phone number must be a valid international format'
      })
    }),
  
    changePassword: Joi.object({
      currentPassword: Joi.string().required().messages({
        'any.required': 'Current password is required'
      }),
      newPassword: Joi.string().min(8).required().messages({
        'string.min': 'New password must be at least 8 characters long',
        'any.required': 'New password is required'
      }),
      confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
        'any.only': 'Confirm password must match new password',
        'any.required': 'Confirm password is required'
      })
    }),
  
    search: Joi.object({
      q: Joi.string().min(1).max(100).optional().messages({
        'string.min': 'Search query must be at least 1 character long',
        'string.max': 'Search query must not exceed 100 characters'
      }),
      limit: Joi.number().integer().min(1).max(50).default(10).messages({
        'number.base': 'Limit must be a number',
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit must not exceed 50'
      }),
      offset: Joi.number().integer().min(0).default(0).messages({
        'number.base': 'Offset must be a number',
        'number.integer': 'Offset must be an integer',
        'number.min': 'Offset must be at least 0'
      }),
      role: Joi.string().valid('admin', 'user').optional().messages({
        'any.only': 'Role must be either admin or user'
      })
    })
  };

/**
 * Validation middleware factory
 */
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    req.body = value;
    next();
  };
}

/**
 * Query validation middleware factory
 */
function validateQuery(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, { 
      abortEarly: false,
      stripUnknown: true 
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Query validation failed',
        details: errors
      });
    }

    req.query = value;
    next();
  };
}

module.exports = {
  courseSchemas,
  userSchemas,
  validate,
  validateQuery
};