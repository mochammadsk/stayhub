module.exports = (app) => {
  const router = require('express').Router();

  router.get('/', (req, res) => {
    res.render('home');
  });

  router.get('/dashboard', (req, res) => {
    if (!req.session.user) {
      return res.render('signin');
    }
    res.render('user/dashboard', { user: req.session.user });
  });

  app.use('/', router);
};
