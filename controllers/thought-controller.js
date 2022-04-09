const {
  Thought,
  User
} = require('../models');

const thoughtController = {

  // get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
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
    body
  }, res) {
    console.log(body);
    Thought.create(body)
      .then((
        ThoughtData
      ) => {
        return User.findOneAndUpdate({
          _id: body.userId
        }, {
          $addToSet: {
            thoughts: ThoughtData._id
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

  // update a thought
  updateThought({
    params,
    body
  }, res) {
    Thought.findOneAndUpdate({
        _id: params.thoughtId
      }, {
        $set: body
      }, {
        runValidators: true,
        new: true
      })
      .then(updateThought => {
        if (!updateThought) {
          return res.status(404).json({
            message: 'No thought found with this Id!'
          });
        }
        return res.json({
          message: "Updated Successfully!"
        });
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
        runValidators: true,
        new: true
      })
      .then((updatedThought => {
          if (!updatedThought) {
            res.status(404).json({
              message: 'No reaction found with this Id!'
            });
            return;
          }
          res.json(updatedThought);
        })
        .catch((err) => res.json(err)));
  },

  // remove comment
  removeThought({
    params
  }, res) {
    Thought.findOneAndDelete({
        _id: params.id
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
      .then((thought) => {
        if (!thought) {
          res.status(404).json({
            message: 'No reaction found with this Id!'
          });
          return;
        }
        res.json(thought)
      })
      .catch(err => res.json(err));
  },
}

module.exports = thoughtController;