const express = require("express");
const cors = require("cors");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerConfig = require("./config/swagger");

const app = express();
const swaggerSpec = swaggerJSDoc(swaggerConfig);
const corsOption = {
  origin: "*",
};

// Middelware CORS and express
app.use(flash());
app.use(express.json());
app.use(cors(corsOption));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Midelleware session
app.use(
  session({
    secret: "StayHub",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000,
      secure: false,
    },
  })
);

// Miiddleware body parser
app.use(
  bodyParser.json({
    extended: true,
    limit: "50mb",
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

// Use EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Call routes
require("./routes/admin.routes")(app);
require("./routes/auth.routes")(app);
require("./routes/public.routes")(app);
require("./routes/user.routes")(app);

module.exports = app;
