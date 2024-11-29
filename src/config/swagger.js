const schema = require('../swagger/shema.swagger');
const path = require('path');

const swaggerConfig = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'StayHub',
    },
    servers: [
      {
        url: 'http://localhost:8000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        components: schema.components,
      },
    },
  },
  apis: [
    path.resolve(__dirname, '../routes/*.js'),
    path.resolve(__dirname, '../swagger/*.js'),
  ],
};

module.exports = swaggerConfig;
