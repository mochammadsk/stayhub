const adminService = require("./admin.controllers");

// Handler login routes
exports.handleLogin = async (req, res) => {
  try {
    const response = await adminService.login(req.body);
    res
      .header("auth-token", response.token)
      .json({ messages: response.message });
  } catch (error) {
    res.status(400).json({ messages: error.message });
  }
};
