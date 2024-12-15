module.exports = (app) => {
  const transaction = require('../controllers/transaction.controller');
  const { auth } = require('../middelware/auth.middleware');
  const router = require('express').Router();

  // Create transaction
  router.post('/callback/:id', auth('user'), (req, res) => {
    transaction.create(req, res);
  });

  // Update transaction
  router.put('/update/:id', auth('admin'), (req, res) => {
    transaction.update(req, res);
  });

  // Get transaction
  router.get('/get', auth('admin'), (req, res) => {
    transaction.getAllTransactions(req, res);
  });

  app.use('/transaction', router);
};
