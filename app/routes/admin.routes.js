module.exports = (app) => {
  const admin = require("../controllers/admin/admin.controllers");
  const { auth } = require("../middelware/auth.middleware");
  const router = require("express").Router();
  const dotenv = require("dotenv");

  dotenv.config();

  // Show data user
  router.get("/list/user", auth("admin"), (req, res) => {
    admin.findAll(req, res);
  });

  // Show data user by id
  router.get("/list/user/:id", auth("admin"), (req, res) => {
    admin.findOne(req, res);
  });

  // Update role user
  router.put("/update/user/:id", auth("admin"), admin.updateRole);

  // Update data
  router.put("/update/:id", auth, (req, res) => {
    admin.update(req, res);
  });

  // Delete data
  router.delete("/delete/:id", auth, (req, res) => {
    admin.delete(req, res);
  });

  app.use("/", router);
};
