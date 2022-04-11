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
        _id: params.thoughtId
      })
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
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
    body
  }, res) {
    console.log(body);
    Thought.create({
        thoughtText: body.thoughtText,
        username: body.username
      })
      .then(({
          _id
        }) =>
        User.findOneAndUpdate({
          _id: body.userId
        }, {
          $push: {
            thoughts: _id
          }
        }, {
          new: true
        }))
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => res.status(400).json(err))
  },

  // update a thought
  updateThought({
    params,
    body
  }, res) {
    Thought.findOneAndUpdate({
          _id: params.thoughtId
        },
        body, {
          runValidators: true,
          new: true
        })
      .then(dbThoughtData => dbThoughtData)
      .catch(err => res.status(400).json(err))

    return res.json({
      message: 'Your thought was successfully updated!'
    });

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
          reactions: {
            _id: params.reactionId,
            reactionBody: body.reactionBody,
            username: body.username
          }
        }
      }, {
        runValidators: true,
        new: true
      })
      .then(dbThoughtData => dbThoughtData)
      .catch(err => res.status(400).json(err));

    return res.json({
      message: 'You have successfully added a reaction to this thought!'
    });
  },

  // remove thought
  removeThought({
    params
  }, res) {
    Thought.findOneAndDelete({
        _id: params.thoughtId
      })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).JSON({
            message: 'No thought with this id!'
          });
          return;
        }
        res.json({
          message: 'You have successfully removed the thought!'
        });
      })
      .catch(err => res.status(400).json(err));
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
            _id: params.reactionId
          }
        }
      }, {
        runValidators: true,
        new: true
      })
      .then(dbThoughtData => dbThoughtData)
      .catch(err => res.status(400).json(err));

    return res.json({
      message: 'You have successfully removed the reaction!'
    });
  }
}

module.exports = thoughtController;