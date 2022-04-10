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
    Thought.create({
        thoughtText: body.thoughtText,
        username: body.username
      })
      .then(({
        _id
      }) => {
        User.findOneAndUpdate({
          _id: body.userId
        }, {
          $push: {
            thoughts: _id
          }
        }, {
          new: true
        });
      })
      .then(dbThoughtData => dbThoughtData);
    return res.json({
        message: 'Your Thought has been added'
      })
      .catch(err => res.status(400).json(err));
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
        _id: params.thoughtId
      })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          status(404).JSON({
            message: 'No thought with this id!'
          });
          return;
        }
        res.json(dbThoughtData);
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