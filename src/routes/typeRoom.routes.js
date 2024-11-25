module.exports = (app) => {
  const type = require('../controllers/typeRoom.controller.js');
  const { auth } = require('../middelware/auth.middleware');
  const { roomImages } = require('../config/multer');
  const router = require('express').Router();

  // Get all
  router.get('/', auth('admin'), (req, res) => {
    type.getAll(req, res);
  });

  // Get one
  router.get('/:id', auth('admin'), (req, res) => {
    type.getOne(req, res);
  });

  // Create
  router.post('/add', auth('admin'), roomImages, (req, res) => {
    type.create(req, res);
  });

  // Update
  router.put('/update/:id', auth('admin'), roomImages, (req, res) => {
    type.update(req, res);
  });

  // Delete one
  router.delete('/delete/:id', auth('admin'), (req, res) => {
    type.deleteById(req, res);
  });

  // Delete all
  router.delete('/delete', auth('admin'), (req, res) => {
    type.deleteAll(req, res);
  });

  app.use('/type', router);
};
