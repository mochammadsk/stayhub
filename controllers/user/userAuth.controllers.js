const userService = require("./user.controllers");

// Handler login routes
exports.handleLogin = async (req, res) => {
  try {
    const response = await userService.signin(req, res);
    req.session.user = response.user;
    res.redirect("/user/dashboard");
  } catch (error) {
    res.status(400).json({ messages: error.message });
  }
};
