module.exports = (app) => {
  const admin = require('../controllers/admin.controller');
  const { auth } = require('../middelware/auth.middleware');
  const router = require('express').Router();
  const dotenv = require('dotenv');

  dotenv.config();

  // Show data user
  router.get('/list/user', auth('admin'), (req, res) => {
    admin.getAll(req, res);
  });

  // Show data user by id
  router.get('/list/user/:id', auth('admin'), (req, res) => {
    admin.getById(req, res);
  });

  // Update role user
  router.put('/update/user/:id', auth('admin'), (req, res) => {
    admin.updateRole;
  });

  // Delete data user
  router.delete('/delete/user/:id', auth('admin'), (req, res) => {
    admin.deleteById(req, res);
  });

  app.use('/', router);
};
