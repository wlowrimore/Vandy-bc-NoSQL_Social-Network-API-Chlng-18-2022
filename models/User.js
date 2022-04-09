const {
  Schema,
  model
} = require('mongoose');

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
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "You've entered an invalid email"
    ],
  },
  thoughts: [{
    type: Schema.Types.ObjectId,
    ref: 'Thought'
  }, ],
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }, ],
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