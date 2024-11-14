module.exports = (app) => {
  const review = require('../controllers/review.controller');
  const { auth } = require('../middelware/auth.middleware');
  const router = require('express').Router();

  // Create review
  router.post('/review/:id', auth('user'), (req, res) => {
    review.addReview(req, res);
  });

  // Update review
  router.put('/review/:id', auth('user'), (req, res) => {
    review.updateReview(req, res);
  });

  app.use('/room', router);
};
