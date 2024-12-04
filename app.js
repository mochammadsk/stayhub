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
const swaggerDocs = swaggerJSDoc(swaggerConfig);

// Middleware CORS & Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  cors({
    origin: [
      'http://localhost:8000',
      'http://127.0.0.1:8000',
      'http://localhost:5173',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Call routes
require('./src/routes/admin.routes')(app);
require('./src/routes/auth.routes')(app);
require('./src/routes/user.routes')(app);
require('./src/routes/room.routes')(app);
require('./src/routes/roomFacility.routes')(app);
require('./src/routes/roomType.routes')(app);
require('./src/routes/roomReview.routes')(app);
require('./src/routes/roomComplaint.routes')(app);
require('./src/routes/transaction.routes')(app);

/* NEXT DEVELOPMENT */
// require('./src/routes/midtrans.routes')(app);

// For testing only
app.get('/', (_req, res) => {
  res.send('StayHub API');
});

module.exports = app;
