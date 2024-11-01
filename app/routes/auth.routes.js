module.exports = (app) => {
  const router = require("express").Router();
  const auth = require("../controllers/auth/login.controllers");
  const { blacklist } = require("../middelware/auth.middleware");

  router.post("/signin", async (req, res) => {
    try {
      await auth.login(req, res);
    } catch (error) {
      res.status(400).json({ messages: error.message });
    }
  });

  router.post("/logout", (req, res) => {
    const token = req.header("auth-token");

    if (!token) return res.status(401).json({ error: "Token not found" });

    blacklist.push(token);
    res.status(200).json({ message: "Logout successful" });
  });

  app.use("/", router);
};
