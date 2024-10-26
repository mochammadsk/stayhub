module.exports = (app) => {
  const router = require("express").Router();
  const auth = require("../controllers/auth/login.controllers");
  router.get("/signup", (req, res) => {
    res.render("signup");
  });

  router.get("/signin", (req, res) => {
    res.render("signin");
  });

  router.post("/signin", async (req, res) => {
    try {
      await auth.login(req, res);
    } catch (error) {
      res.status(400).json({ messages: error.message });
    }
  });

  router.post("/logout", (req, res) => {
    res.header("auth-token", "").json({ message: "Logout successful" });
  });

  app.use("/", router);
};
