module.exports = (app) => {
  const facility = require('../controllers/roomFacility.controller.js');
  const { auth } = require('../middelware/auth.middleware.js');
  const router = require('express').Router();

  // Get all
  router.get('/', auth('admin'), (req, res) => {
    facility.getAll(req, res);
  });

  // Get by id
  router.get('/:id', auth('admin'), (req, res) => {
    facility.getById(req, res);
  });

  // Create
  router.post('/add', auth('admin'), (req, res) => {
    facility.create(req, res);
  });

  // Update
  router.put('/update/:id', auth('admin'), (req, res) => {
    facility.update(req, res);
  });

  // Delete by id
  router.delete('/delete/:id', auth('admin'), (req, res) => {
    facility.deleteById(req, res);
  });

  // Delete all
  router.delete('/delete', auth('admin'), (req, res) => {
    facility.deleteAll(req, res);
  });

  app.use('/facility', router);
};
