module.exports = (app) => {
  const review = require('../controllers/review.controller');
  const { auth } = require('../middelware/auth.middleware');
  const router = require('express').Router();

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
    review.delete(req, res);
  });

  app.use('/review', router);
};
