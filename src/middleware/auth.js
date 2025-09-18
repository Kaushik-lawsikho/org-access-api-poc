const { ApiKey } = require('../models');

async function authenticateApiKey(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'API key required. Format: Bearer <api_key>' 
      });
    }

    const apiKey = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const keyRecord = await ApiKey.findOne({
      where: { 
        key: apiKey,
        isActive: true 
      },
      include: ['organization', 'brand']
    });

    if (!keyRecord) {
      return res.status(401).json({ 
        error: 'Invalid or inactive API key' 
      });
    }

    // Check if API key is expired
    if (keyRecord.expiresAt && new Date() > keyRecord.expiresAt) {
      return res.status(401).json({ 
        error: 'API key has expired' 
      });
    }

    // Add organization and brand context to request
    req.context = {
      organizationId: keyRecord.organizationId,
      brandId: keyRecord.brandId,
      organization: keyRecord.organization,
      brand: keyRecord.brand
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

module.exports = { authenticateApiKey };