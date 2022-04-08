const {
  Thought,
  User
} = require('../models');

const thoughtController = {

  // get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .sort({
        _id: -1
      })
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // get a single thought
  getThoughtById({
    params
  }, res) {
    Thought.findOne({
        _id: params.id
      })
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .sort({
        _id: -1
      })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({
            message: 'No thought found by this id!'
          });
          return;
        }
        res.json(dbThoughtData)
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // add thought to a user
  addThought({
    params,
    body
  }, res) {
    Thought.create(body)
      .then(({
        _id
      }) => {
        return User.findOneAndUpdate({
          _id: params.userId
        }, {
          $push: {
            thoughts: _id
          }
        }, {
          new: true
        });
      })
      .then(dbUserData => {
        console.log(dbUserData);
        if (!dbUserData) {
          res.status(404).json({
            message: 'No user found with this id!'
          });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // update a thought
  updateThought({
    params,
    body
  }, res) {
    Thought.findOneAndUpdate({
        _id: params.id
      }, body, {
        new: true,
        runValidators: true
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

  // add reaction to thought
  addReaction({
    params,
    body
  }, res) {
    Thought.findOneAndUpdate({
        _id: params.thoughtId
      }, {
        $push: {
          reactions: body
        }
      }, {
        new: true,
        runValidators: true
      })
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({
            message: 'No user found with this id!'
          });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // remove comment
  removeThought({
    params
  }, res) {
    Thought.findOneAndDelete({
        _id: params.reactionId
      })
      .then(deletedThought => {
        if (!deletedThought) {
          return res.status(404).json({
            message: 'No thought with this id!'
          });
        }
        return User.findOneAndUpdate({
          _id: params.userId
        }, {
          $pull: {
            thoughts: params.id
          }
        }, {
          new: true
        });
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({
            message: 'No user found with this id!'
          });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // remove reaction
  removeReaction({
    params
  }, res) {
    Thought.findOneAndUpdate({
        _id: params.thoughtId
      }, {
        $pull: {
          reactions: {
            reactionId: params.reactionId
          }
        }
      }, {
        new: true
      })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  }
};

module.exports = thoughtController;