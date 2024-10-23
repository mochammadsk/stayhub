module.exports = (app) => {
  const router = require("express").Router();

  // Public routes
  router.get("/", (req, res) => {
    res.render("home");
  });

  router.get("/signup", (req, res) => {
    res.render("signup");
  });

  router.get("/signin", (req, res) => {
    res.render("signin");
  });

  app.use("/", router);
};
