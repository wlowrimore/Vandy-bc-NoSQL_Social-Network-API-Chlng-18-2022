const {
  User
} = require('../models');
const Thought = require('../models/Thought');
const {
  populate
} = require('../models/User');

const userController = {
  // get all Users
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: 'thoughts',
        select: ('-__v')
      })
      .populate({
        path: 'friends',
        select: ('-__v')
      })
      .select('-__id')
      .sort({
        _id: -1
      })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one User by Id
  getUserById({
    params
  }, res) {
    User.findOne({
        _id: params.id
      })
      .populate({
        path: 'thoughts',
        select: ('-__v')
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
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // create a new User
  createUser({
    body
  }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(400).json(err));
  },

  // update a User by Id
  updateUser({
    params,
    body
  }, res) {
    User.findOneAndUpdate({
        _id: params.id
      }, body, {
        new: true,
        runValidators: true
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
      .catch(err => res.status(400).json(err));
  },

  // delete a User
  deleteUser({
    params
  }, res) {
    User.findOneAndDelete({
        _id: params.id
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
      .then(dbUserData => {
        User.updateMany({
            _id: {
              $in: dbUserData.friends
            }
          }, {
            $pull: {
              friends: params.userId
            }
          })
          .then(() => {
            Thought.deleteMany({
                username: dbUserData.username
              })
              .then(() => {
                res.json({
                  message: 'User successfully deleted'
                });
              })
              .catch(err => {
                console.log(err);
                res.status(400).json(err);
              })
          })
          .catch(err => {
            console.log(err);
            res.status(400).json(err);
          })
      })
      .console.log(err)
      .catch(err => res.status(400).json(err));
  },

  // add friends
  addToFriendList({
    params
  }, res) {
    User.findOneAndUpdate({
        id: params.userId
      }, {
        $push: {
          friends: params.friendId
        }
      }, {
        new: true
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(400).json({
            message: 'No user found with this id!'
          });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err)
        res.json(err)
      });
  },

  // delete a friend for the friends list
  removeFromFriendList({
    params
  }, res) {
    User.findOneAndDelete({
        _id: params.thought.Id
      })
      .then(deletedFriend => {
        if (!deletedFriend) {
          return res.status(404).json({
            message: 'No friend found with this Id!'
          });
          return;
        }
        returnUser.findOneAndUpdate({
          friends: params.friendId
        }, {
          $pull: {
            friends: params.friendId
          }
        }, {
          new: true
        });
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({
            message: 'No friend found with this id!'
          });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },
};

module.exports = userController;