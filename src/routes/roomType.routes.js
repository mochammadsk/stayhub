module.exports = (app) => {
  const type = require('../controllers/roomType.controller.js');
  const { auth } = require('../middelware/auth.middleware.js');
  const router = require('express').Router();

  // Get all
  router.get('/', (req, res) => {
    type.getAll(req, res);
  });

  // Get by id
  router.get('/:id',(req, res) => {
    type.getById(req, res);
  });

  // Create
  router.post('/add', (req, res) => {
    type.create(req, res);
  });

  // Update
  router.put('/update/:id', (req, res) => {
    type.update(req, res);
  });

  // Delete by id
  router.delete('/delete/:id', (req, res) => {
    type.deleteById(req, res);
  });

  // Delete all
  router.delete('/delete',(req, res) => {
    type.deleteAll(req, res);
  });

  app.use('/type', router);
};
