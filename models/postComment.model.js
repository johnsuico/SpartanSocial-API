const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema ({
  commentAuthor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'commentAuthor',
    required: true
  },
  commentBody: {
    type: String,
    required: true
  },
  commentDate: {
    type: Date,
    default: Date.now
  },
  parentPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'parentPost',
    required: true
  },
  commentUpvotes: {
    type: Number,
    default: 0
  },
  commentDownvotes: {
    type: Number,
    default: 0
  }
})

const postComment = mongoose.model('postComment', commentSchema);

module.exports = postComment;