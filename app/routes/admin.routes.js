module.exports = (app) => {
  const admin = require("../controllers/admin/admin.controllers");
  const { register } = require("../controllers/admin/admin.controllers");
  const adminService = require("../controllers/admin/adminAuth.controllers");
  const validateRegistration = require("../middelware/validateRegristation");
  const { auth, isAdmin } = require("../middelware/subsAuth");
  const r = require("express").Router();
  const dotenv = require("dotenv");

  dotenv.config();

  // Register account
  const SECRET_CODE = process.env.SECRET_CODE;

  r.post("/signup", validateRegistration, (req, res) => {
    const { secretCode, ...data } = req.body;

    if (secretCode !== SECRET_CODE) {
      return res
        .status(403)
        .json({ message: "Forbidden: Invalid secret code" });
    }

    register(data)
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(400).json(error));
  });

  // Verification email for register account
  r.get("/verify/:uniqueString", admin.verifyEmail);

  // Login account
  r.post("/signin", adminService.handleLogin);

  // Password reset
  r.post("/forgot-password", (req, res) => {
    admin.resetPassword(req, res);
  });

  // Verification email for password rest
  r.post("/verify", (req, res) => {
    admin.verifyResetPassword(req, res);
  });

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
