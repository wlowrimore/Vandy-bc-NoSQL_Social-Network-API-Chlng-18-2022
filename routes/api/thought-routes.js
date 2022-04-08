const router = require('express').Router();
const {
  getAllThought,
  getThoughtById,
  createThought,
  updateThoughtr,
  deleteThoughtr
} = require('../../controllers/thought-controller');

router
  .route('/')
  .get(getAllThought)
  .post(createThought);

router
  .route('/:id')
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

module.exports = router;