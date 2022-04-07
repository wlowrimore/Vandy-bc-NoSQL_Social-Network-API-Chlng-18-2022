const {
  default: mongoose
} = require('mongoose');
const {
  Schema,
  model
} = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: [true, "can't be blank"],
    validate: {
      validator: function (v) {
        return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(v);
      }
    }
  },
  thoughts: [{
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Thought'
    }
  }],
  friends: [{
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  toJSON: {
    virtuals: true,
    getters: true
  },
  // prevents virtuals from creating duplicates of user's friends' array length
  id: false
});

// get total friendCount of user
UserSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User;