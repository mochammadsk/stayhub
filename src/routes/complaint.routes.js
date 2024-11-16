module.exports = (app) => {
  const complaint = require('../controllers/complaint.controller');
  const { auth } = require('../middelware/auth.middleware');
  const { uploadComplaintImages } = require('../config/multer');
  const dotenv = require('dotenv');
  const router = require('express').Router();

  dotenv.config();

  // Get all complaint
  router.get('/', auth('user', 'admin'), complaint.findAll);

  // Get complaint by id
  router.get('/:id', auth('user', 'admin'), complaint.findById);

  // Create complaint
  router.post(
    '/create',
    auth('user'),
    uploadComplaintImages,
    complaint.addKeluhan
  );

  // Update complaint by id
  router.put(
    '/update/:id',
    auth('user'),
    uploadComplaintImages,
    complaint.update
  );

  // Delete complaint by id
  router.delete('/delete/:id', auth('user'), complaint.deleteById);

  app.use('/complaint', router);
};
