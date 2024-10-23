module.exports = (app) => {
  const user = require("../controllers/user/user.controllers");
  const { register } = require("../controllers/user/user.controllers");
  const userService = require("../controllers/user/userAuth.controllers");
  const validateRegistration = require("../middelware/validateRegristation");
  const { auth, isAdmin } = require("../middelware/subsAuth");
  const router = require("express").Router();

  router.post("/signup", validateRegistration, (req, res) => {
    const data = req.body;
    register(data)
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(400).json(error));
  });

  // Verification email for register account
  router.get("/verify/:uniqueString", user.verifyEmail);

  // Login account
  router.post("/signin", userService.handleLogin);

  router.get("/dashboard", (req, res) => {
    if (!req.session.user) {
      return res.render("signin");
    }
    res.render("user/dashboard", { user: req.session.user });
  });

  // Logout account
  router.post("/logout/:id", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed!" });
      }
      res.status(200).json({ message: "Logged out successfully!" });
    });
  });

  // Password reset
  router.post("/forgot-password", (req, res) => {
    user.resetPassword(req, res);
  });

  // Verification email for password rest
  router.post("/verify", (req, res) => {
    user.verifyResetPassword(req, res);
  });

  // Update profile data
  router.put("/profile/update/:id", auth, (req, res) => {
    user.update(req, res);
  });

  // Delete data
  router.delete("/delete/:id", auth, isAdmin, (req, res) => {
    user.delete(req, res);
  });

  // Google Auth
  router.get("/auth/google", user.googleAuthRedirect);
  router.get("/auth/google/callback", user.googleAuthCallback);

  app.use("/user", router);
};
