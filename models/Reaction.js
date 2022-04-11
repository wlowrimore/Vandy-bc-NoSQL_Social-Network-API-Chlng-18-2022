const {
  Schema,
  Types
} = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const reationSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId()
  },
  reactionBody: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280
  },
  createdAt: {
    type: DataTransfer,
    default: Date.now,
    get: createdAtVal => dateFormat(createdAtVal)
  }
}, {
  toJSON: {
    getters: true
  },
  id: false
});

module.exports = reactionSchema;