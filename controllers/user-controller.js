const {
  User,
  Thought
} = require('../models');

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
        select: ('-_v')
      })
      .select('-__v')
      .sort({
        _id: -1
      })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
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
      .populate({
        path: 'friends',
        select: ('-_v')
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
      .catch(err => res.json(err));
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
            message: 'No user found with this Id!'
          });
        }
        return dbUserData;
      })
      .then(dbUserData => {
        User.updateMany({}, {
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
                  message: 'You have successfully deleted the User'
                });
              })
              .catch(err => {
                console.log(err);
                res.status(400).json(err);
              })
          })

      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      })
  },

  // add friends
  addToFriendList({
    params
  }, res) {
    User.findOneAndUpdate({
        id: params.userId
      }, {
        $addToSet: {
          friends: params.friendId
        }
      }, {
        new: true,
        runValidators: true
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({
            message: 'No user found with this id!'
          });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // delete a friend for the friends list
  removeFromFriendList({
    params
  }, res) {
    User.findOneAndUpdate({
        _id: params.userId
      }, {
        $pull: {
          friends: params.friendId
        }
      }, {
        new: true
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({
            message: 'No user found with this id!'
          });
          return;
        }
        res.json({
          message: 'This friend has been successfully removed!'
        });
      })
      .catch((err) => res.status(400).json(err));

  }
}

module.exports = userController;