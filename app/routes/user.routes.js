module.exports = (app) => {
  const user = require("../controllers/user/user.controllers");
  const { register } = require("../controllers/user/user.controllers");
  const userService = require("../controllers/user/userAuth.controller");
  const validateRegistration = require("../middelware/validateRegristation");
  const { auth, isAdmin } = require("../middelware/subsAuth");
  const r = require("express").Router();

  // Register account
  r.post("/signup", validateRegistration, (req, res) => {
    const data = req.body;
    register(data)
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(400).json(error));
  });

  // Verification email for register account
  r.get("/verify/:uniqueString", user.verifyEmail);

  // Login account
  r.post("/signin", userService.handleLogin);

  // Password reset
  r.post("/forgot-password", (req, res) => {
    user.resetPassword(req, res);
  });

  // Verification email for password rest
  r.post("/verify", (req, res) => {
    user.verifyResetPassword(req, res);
  });

  // Update data
  r.put("/update/:id", auth, (req, res) => {
    user.update(req, res);
  });

  // Delete data
  r.delete("/delete/:id", auth, isAdmin, (req, res) => {
    user.delete(req, res);
  });

  // Google Auth
  r.get("/auth/google", user.googleAuthRedirect);
  r.get("/auth/google/callback", user.googleAuthCallback);

  app.use("/user", r);
};
