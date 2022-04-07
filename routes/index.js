const router = require('express').Router();

// Imports all API routes from /api/index.js
const apiRoutes = require('./api');

// adds prefix of '/api' to the api routes iported from the 'api' directory
router.use('/api', apiRoutes);

router.use((req, res) => {
  res.status(404).send('<h1>😝 404 Error!</h1>');
});

module.exports = router;