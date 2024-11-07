module.exports = (app) => {
  const user = require('../controllers/user.controller');
  const userService = require('../controllers/userAuth.controller');
  const { auth } = require('../middelware/auth.middleware');
  const router = require('express').Router();

  // Login account
  router.post('/signin', userService.handleLogin);

  // Logout account
  router.post('/logout/:id', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed!' });
      }
      res.status(200).json({ message: 'Logged out successfully!' });
    });
  });

  // Update profile data
  router.put('/profile/update/:id', auth, (req, res) => {
    user.update(req, res);
  });

  // Delete data
  router.delete('/delete/:id', auth, (req, res) => {
    user.delete(req, res);
  });

  app.use('/', router);
};
