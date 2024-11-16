module.exports = (app) => {
  const user = require('../controllers/user.controller');
  const { auth } = require('../middelware/auth.middleware');
  const { uploadProfileImages } = require('../config/multer');
  const router = require('express').Router();

  // Update profile data
  router.put(
    '/profile/update',
    auth('user'),
    uploadProfileImages,
    (req, res) => {
      user.updateProfile(req, res);
    }
  );

  // Delete data
  router.delete('/delete/:id', auth, (req, res) => {
    user.delete(req, res);
  });

  app.use('/', router);
};
