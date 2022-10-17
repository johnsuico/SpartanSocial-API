const mongoose = require('mongoose');

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
  votedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: votedPosts
  }]

})

const User = mongoose.model('User', userSchema);

module.exports = User;