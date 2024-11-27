module.exports = (app) => {
  const facility = require('../controllers/roomFacility.controller.js');
  const { auth } = require('../middelware/auth.middleware.js');
  const router = require('express').Router();

  // Get all
  router.get('/', (req, res) => {
    facility.getAll(req, res);
  });

  // Get by id
  router.get('/:id', (req, res) => {
    facility.getById(req, res);
  });

  // Create
  router.post('/add', (req, res) => {
    facility.create(req, res);
  });

  // Update
  router.put('/update/:id', (req, res) => {
    facility.update(req, res);
  });

  // Delete by id
  router.delete('/delete/:id', (req, res) => {
    facility.deleteById(req, res);
  });

  // Delete all
  router.delete('/delete', auth('admin'), (req, res) => {
    facility.deleteAll(req, res);
  });

  app.use('/facility', router);
};
