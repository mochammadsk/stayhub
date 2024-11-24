module.exports = (app) => {
  const review = require('../controllers/review.controller');
  const { auth } = require('../middelware/auth.middleware');
  const router = require('express').Router();

  // Create review
  router.post('/:id', auth('user'), (req, res) => {
    review.addReview(req, res);
  });

  // Update review
  router.put('/:id', auth('user'), (req, res) => {
    review.updateReview(req, res);
  });

  // Delete review
  router.delete('/:id', auth('user'), (req, res) => {
    review.deleteReview(req, res);
  });

  app.use('/review', router);
};
