const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Load the swagger.yaml file
const swaggerDocument = YAML.load(path.join(__dirname, '../../swagger.yaml'));

// Swagger options
const swaggerOptions = {
  definition: swaggerDocument,
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/models/*.js'
  ]
};

// Generate swagger specs
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI options
const swaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info { margin: 20px 0; }
    .swagger-ui .info .title { color: #3b82f6; }
    .swagger-ui .scheme-container { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .swagger-ui .btn.authorize { background-color: #3b82f6; border-color: #3b82f6; }
    .swagger-ui .btn.authorize:hover { background-color: #2563eb; border-color: #2563eb; }
    .swagger-ui .btn.authorize svg { fill: white; }
    .swagger-ui .auth-wrapper { margin: 20px 0; }
  `,
  customSiteTitle: 'Organization Access API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    showRequestHeaders: true,
    showCommonExtensions: true,
    tryItOutEnabled: true
  }
};

module.exports = {
  swaggerSpec,
  swaggerUi,
  swaggerUiOptions,
  swaggerDocument
};
