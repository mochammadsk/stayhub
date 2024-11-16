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

  // Delete photo profile
  router.delete(
    '/profile/update',
    auth('user'),
    uploadProfileImages,
    (req, res) => {
      user.deletePhotoProfile(req, res);
    }
  );

  app.use('/', router);
};
