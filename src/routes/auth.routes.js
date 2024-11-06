module.exports = (app) => {
  const router = require('express').Router();
  const auth = require('../controllers/auth.controller');
  const { blacklist } = require('../middelware/auth.middleware');
  const validateRegistration = require('../middelware/validateRegristation');

  // Register account for user
  router.post('/signup', validateRegistration, auth.register);

  // Email verification for user register account
  router.get('/user/verify/:uniqueString', auth.verifyEmail);

  // Login account
  router.post('/signin', async (req, res) => {
    try {
      await auth.login(req, res);
    } catch (error) {
      res.status(400).json({ messages: error.message });
    }
  });

  // Google Auth
  router.get('/auth/google', auth.googleAuthRedirect);
  router.get('/auth/google/callback', auth.googleAuthCallback);

  // Logout account
  router.post('/logout', (req, res) => {
    const token = req.header('auth-token');

    if (!token) return res.status(401).json({ error: 'Token not found' });

    blacklist.push(token);
    res.status(200).json({ message: 'Logout successful' });
  });

  app.use('/', router);
};
