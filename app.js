const express = require("express");
const cors = require("cors");
const flash = require("connect-flash");
const bodyParser = require("body-parser");

const app = express();

const corsOption = {
  origin: "*",
};

const session = require("express-session");
app.use(
  session({
    secret: "rahasia",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Middelware
app.use(flash());
app.use(express.json());
app.use(cors(corsOption));
app.use(express.urlencoded({ extended: true }));

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

// Call routes
require("./app/routes/admin.routes")(app);

module.exports = app;
