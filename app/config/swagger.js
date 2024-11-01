const schema = require("../swagger/shema.swagger");

const swaggerConfig = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API Documentation for StayHub",
    },
    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        components: schema.components,
      },
    },
  },
  apis: ["./app/routes/*.js", "./app/swagger/*.js"],
};

module.exports = swaggerConfig;
