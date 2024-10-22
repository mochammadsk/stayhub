module.exports = (app) => {
  const admin = require("../controllers/admin/admin.controllers");
  const adminService = require("../controllers/admin/adminAuth.controllers");
  const { auth, isAdmin } = require("../middelware/subsAuth");
  const router = require("express").Router();
  const dotenv = require("dotenv");

  dotenv.config();

  // Login account
  router.post("/signin", adminService.handleLogin);

  // Logout account
  router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed!" });
      }
      res.status(200).json({ message: "Logged out successfully!" });
    });
  });

  // Show data user
  router.get("/list/user", auth, isAdmin, (req, res) => {
    admin.findAll(req, res);
  });

  router.get("/list/:id", auth, isAdmin, (req, res) => {
    admin.show(req, res);
  });

  // Update data
  router.put("/update/:id", auth, isAdmin, (req, res) => {
    admin.update(req, res);
  });

  // Delete data
  router.delete("/delete/:id", auth, isAdmin, (req, res) => {
    admin.delete(req, res);
  });

  app.use("/admin", router);
};
