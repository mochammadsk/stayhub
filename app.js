const cors = require("cors");
const express = require("express");
const path = require("path");
const session = require("express-session");
const swaggerConfig = require("./app/config/swagger");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();

const swaggerSpec = swaggerJSDoc(swaggerConfig);

// Middleware CORS & Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    method: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

// Midelleware session
app.use(
  session({
    secret: "StayHub",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60000,
      secure: false,
    },
  })
);

// Middleware Logger
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Call routes
require("./app/routes/admin.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/public.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/room.routes")(app);

module.exports = app;
