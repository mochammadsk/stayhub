const cors = require('cors');
const express = require('express');
const path = require('path');
const session = require('express-session');
const swaggerConfig = require('./src/config/swagger');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv');

// Create app
const app = express();
// Config dotenv
dotenv.config();
// Config swagger
const swaggerSpec = swaggerJSDoc(swaggerConfig);

// Middleware CORS & Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  cors({
    origin: ['http://localhost:8000', 'http://127.0.0.1:8000'],
    method: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  })
);

// Midelleware session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60000, // 1 minute
      secure: false,
    },
  })
);

// Middleware Logger
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Call routes
require('./src/routes/admin.routes')(app);
require('./src/routes/auth.routes')(app);
require('./src/routes/user.routes')(app);
require('./src/routes/room.routes')(app);
require('./src/routes/facilityRoom.routes')(app);
require('./src/routes/typeRoom.routes')(app);
require('./src/routes/transaction.routes')(app);
require('./src/routes/review.routes')(app);
require('./src/routes/complaint.routes')(app);

module.exports = app;