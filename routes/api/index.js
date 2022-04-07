const router = require('express').Router();
const userRoutes = require('./user-routes');
const thoughtRoutes = require('./thought-routes');

// adds '/users' to routes created in 'user-routes.js', 'thought-routes.js'
router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;