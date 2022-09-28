const mongoose = require('mongoose');
const forumPost = require('./forumPost.model');

const subForumSchema = new mongoose.Schema ({
  subForumTitle: {
    type: String,
    required: true
  },
  subForumDesc: {
    type: String,
    required: true
  },
  subForumAuthor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  parentForum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent'
  },
  subForumDate: {
    type: Date,
    default: Date.now
  },
  forumUpVotes: {
    type: Number,
    default: 0
  },
  forumDownVotes: {
    type: Number,
    default: 0
  },
  forumPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: forumPost
  }]
})

const subForum = mongoose.model('subForum', subForumSchema);

module.exports = subForum;