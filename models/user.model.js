const mongoose = require('mongoose');

const userSchema = new mongoose.Schema ({
  firstName: {
    type: String,
    required: true
  },
  lastName:{
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
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
  }

})

const User = mongoose.model('User', userSchema);

module.exports = User;