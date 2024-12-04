module.exports = (app) => {
  const review = require('../controllers/roomReview.controller');
  const { auth } = require('../middelware/auth.middleware');
  const router = require('express').Router();

  // Get review by id review
  router.get('/:id', auth('user'), (req, res) => {
    review.getById(req, res);
  });

  // Create review
  router.post('/:id', auth('user'), (req, res) => {
    review.create(req, res);
  });

  // Update review
  router.put('/:id', auth('user'), (req, res) => {
    review.update(req, res);
  });

  // Delete review
  router.delete('/:id', auth('user'), (req, res) => {
    review.deleteById(req, res);
  });

  app.use('/review', router);
};
