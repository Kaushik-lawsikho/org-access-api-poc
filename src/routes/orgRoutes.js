const express = require('express');
const router = express.Router();
const { authenticateApiKey } = require('../middleware/auth');

// GET /api/org/info - Get organization and brand information
router.get('/info', authenticateApiKey, (req, res) => {
  res.json({
    success: true,
    data: {
      organization: {
        id: req.context.organization.id,
        name: req.context.organization.name,
        description: req.context.organization.description
      },
      brand: req.context.brand ? {
        id: req.context.brand.id,
        name: req.context.brand.name,
        description: req.context.brand.description
      } : null,
      accessLevel: req.context.brand ? 'brand' : 'organization'
    }
  });
});

module.exports = router;