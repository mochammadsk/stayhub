const userService = require('./user.controller');

// Handler login routes
exports.handleLogin = async (req, res) => {
  try {
    // Save user to session
    const response = await userService.signin(req, res);
    req.session.user = response.user;
    // Redirect
    res.redirect('/user/dashboard');
  } catch (error) {
    res.status(400).json({ messages: error.message });
  }
};
