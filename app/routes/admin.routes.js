module.exports = (app) => {
  const admin = require("../controllers/admin/admin.controllers");
  const adminService = require("../controllers/admin/adminAuth.controllers");
  const { auth, isAdmin } = require("../middelware/subsAuth");
  const r = require("express").Router();
  const dotenv = require("dotenv");

  dotenv.config();

  // Login account
  r.post("/signin", adminService.handleLogin);

  // Show data
  r.get("/list", auth, isAdmin, (req, res) => {
    admin.findAll(req, res);
  });

  r.get("/list/:id", auth, isAdmin, (req, res) => {
    admin.show(req, res);
  });

  // Update data
  r.put("/update/:id", auth, isAdmin, (req, res) => {
    admin.update(req, res);
  });

  // Delete data
  r.delete("/delete/:id", auth, isAdmin, (req, res) => {
    admin.delete(req, res);
  });

  app.use("/admin", r);
};
