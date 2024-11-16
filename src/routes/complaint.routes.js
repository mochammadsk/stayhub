module.exports = (app) => {
  const complaint = require('../controllers/complaint.controller');
  const { auth } = require('../middelware/auth.middleware');
  const { complaintImages } = require('../config/multer');
  const dotenv = require('dotenv');
  const router = require('express').Router();

  dotenv.config();

  // Get all complaint
  router.get('/', auth('user', 'admin'), (req, res) => {
    complaint.findAll(req, res);
  });

  // Get complaint by id
  router.get('/:id', auth('user', 'admin'), (req, res) => {
    complaint.findById(req, res);
  });

  // Create complaint
  router.post('/complaint/:id', auth('user'), complaintImages, (req, res) => {
    complaint.add(req, res);
  });

  // Update complaint by id
  router.put('/complaint/:id', auth('user'), complaintImages, (req, res) => {
    complaint.update(req, res);
  });

  // Delete complaint by id
  router.delete('/complaint/:id', auth('user'), (req, res) => {
    complaint.deleteById(req, res);
  });

  app.use('/room', router);
};
