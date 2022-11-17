const mongoose = require('mongoose');
const forumPosts = require('./forumPost.model');
const upvotedPosts = require('./forumPost.model');
const downvotedPosts = require('./forumPost.model');
const goingEvents = require('./events.model');
const notGoingEvents = require('./events.model');
const events = require('./events.model');

const userSchema = new mongoose.Schema ({
  firstName: {
    type: String,
    default: ''
  },
  lastName:{
    type: String,
    default: ''
  },
  userName: {
    type: String,
    default: ''
  },
  useDisplayName: {
    type: Boolean,
    default: false
  },
  hashedPassword: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  admin: {
    type: Boolean,
    default: false
  },
  moderator: {
    type: Boolean,
    default: false
  },
  major: {
    type: String,
    default: ''
  },
  isStudent: {
    type: Boolean,
    default: false
  },
  gradDate: {
    type: Date
  },
  birthDate: {
    type: Date
  },
  gender: {
    type: String,
    default: ''
  },
  pronouns: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  register_date: {
    type: Date,
    default: Date.now
  },
  forumPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: forumPosts
  }],
  upvotedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: upvotedPosts
  }],
  downvotedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: downvotedPosts
  }],
  createdEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: events
  }],
  goingEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: goingEvents
  }],
  notGoingEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:notGoingEvents
  }],
  forumComments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'forumComments'
  }],
  upvotedComments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'upvotedComments'
  }],
  downvotedComments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'downvotedComments'
  }]

})

const User = mongoose.model('User', userSchema);

module.exports = User;