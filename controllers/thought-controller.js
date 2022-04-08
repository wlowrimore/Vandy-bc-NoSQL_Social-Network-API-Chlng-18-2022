const {
  Thought,
  User
} = require('../models');

const thoughtController = {
  // get all Thoughts
  getAllThought(req, res) {
    User.find({})
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one User by Id
  getThoughtById({
    params
  }, res) {
    User.findOne({
        _id: params.id
      })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({
            message: 'No thought found with this id!'
          });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // create a new User
  createThought({
    body
  }, res) {
    User.create(body)
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => res.status(400).json(err));
  },

  // update a User by Id
  updateThought({
    params,
    body
  }, res) {
    User.findOneAndUpdate({
        _id: params.id
      }, body, {
        new: true
      })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({
            message: 'No thought found with this id!'
          });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
  },

  // delete a User
  deleteThought({
    params
  }, res) {
    User.findOneAndDelete({
        _id: params.id
      })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({
            message: 'No thought found with this id!'
          });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
  }
};

module.exports = thoughtController;
}