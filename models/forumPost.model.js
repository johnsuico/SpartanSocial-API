const mongoose = require('mongoose');
const User = require('./user.model');

const forumPostSchema = new mongoose.Schema ({
  forumPostTitle: {
    type: String,
    required: true
  },
  forumPostBody: {
    type: String,
    required: true
  },
  forumPostAuthor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  forumPostDate: {
    type: Date,
    default: Date.now
  }
})

const forumPost = mongoose.model('forumPost', forumPostSchema);

module.exports = forumPost;