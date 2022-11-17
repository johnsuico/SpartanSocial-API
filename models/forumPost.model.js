const mongoose = require('mongoose');
const forumComments = require('./postComment.model');

const forumPostSchema = new mongoose.Schema ({
  forumPostTitle: {
    type: String,
    required: true
  },
  forumPostBody: {
    type: String,
    required: true
  },
  forumPostCategory: {
    type: String,
    default: ''
  },
  forumPostAuthor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  parentSubForum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent'
  },
  postUpVotes: {
    type: Number,
    default: 0
  },
  postDownVotes: {
    type: Number,
    default: 0
  },
  forumPostDate: {
    type: Date,
    default: Date.now
  },
  forumComments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: forumComments
  }]
})

const forumPost = mongoose.model('forumPost', forumPostSchema);

module.exports = forumPost;